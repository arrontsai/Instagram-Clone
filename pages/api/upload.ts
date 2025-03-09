import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { v2 as cloudinary } from 'cloudinary';

// 在服務器端配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: '未授權' });
    }

    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: '未提供圖片' });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: 'instagram-clone',
      transformation: [
        { width: 1080, crop: 'scale' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('上傳圖片時出錯:', error);
    res.status(500).json({ message: '上傳圖片時出錯' });
  }
} 