import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { v2 as cloudinary } from 'cloudinary';

// 在服務器端配置 Cloudinary
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// 確保配置正確
console.log('Cloudinary 配置詳情:', {
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret ? '已設置' : '未設置',
});

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只允許 POST 請求' });
  }

  try {
    // 驗證 Cloudinary 配置
    console.log('處理上傳請求，Cloudinary 配置:', {
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret ? '已設置' : '未設置',
    });

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: '未授權' });
    }

    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: '未提供圖片' });
    }

    try {
      console.log('開始上傳到 Cloudinary...');
      const result = await cloudinary.uploader.upload(image, {
        folder: 'instagram-clone',
        transformation: [
          { width: 1080, crop: 'scale' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });

      console.log('Cloudinary 上傳成功:', result.secure_url);
      res.status(200).json({ url: result.secure_url });
    } catch (uploadError: any) {
      console.error('Cloudinary 上傳錯誤詳情:', uploadError);
      res.status(500).json({ 
        message: '上傳圖片時出錯', 
        error: uploadError.message || '未知錯誤',
        code: uploadError.http_code || uploadError.code || '未知錯誤代碼'
      });
    }
  } catch (error: any) {
    console.error('API 路由錯誤:', error);
    res.status(500).json({ 
      message: '處理請求時出錯', 
      error: error.message || '未知錯誤' 
    });
  }
} 