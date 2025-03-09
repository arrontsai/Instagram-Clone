// 客戶端不需要直接導入 cloudinary 庫
// 我們只在 API 路由中使用它

export const uploadImage = async (file: string): Promise<string> => {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: file }),
    });

    if (!response.ok) {
      throw new Error('上傳圖片失敗');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('上傳圖片到 Cloudinary 時出錯:', error);
    throw error;
  }
}; 