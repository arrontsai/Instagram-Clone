// 客戶端不需要直接導入 cloudinary 庫
// 我們只在 API 路由中使用它

export const uploadImage = async (file: string): Promise<string> => {
  try {
    console.log('開始上傳圖片到 Cloudinary...');
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: file }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('上傳失敗，伺服器回應:', data);
      throw new Error(data.error || '上傳失敗');
    }

    console.log('上傳成功，URL:', data.url);
    return data.url;
  } catch (error) {
    console.error('上傳圖片到 Cloudinary 時出錯:', error);
    throw error;
  }
}; 