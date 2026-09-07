'use client';

import { useEffect } from 'react';

const APP_ID = 54757507;

export default function AuthPage() {
  useEffect(() => {
    // Получаем токен из URL
    const hash = window.location.hash;
    const match = hash.match(/access_token=([^&]+)/);
    
    if (match) {
      localStorage.setItem('vk_token', match[1]);
      window.location.href = '/';
    }
  }, []);

  const handleLogin = () => {
    const redirectUri = window.location.origin;
    const scope = 'friends,photos,video,wall,offline,status,groups';
    const authUrl = `https://oauth.vk.com/authorize?client_id=${APP_ID}&display=popup&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&v=5.131`;
    window.location.href = authUrl;
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#f0f2f5]">
      <div className="text-center">
        <p className="text-4xl mb-4">🔐</p>
        <p className="text-gray-500 mb-4">Войдите через VK</p>
        <button
          onClick={handleLogin}
          className="bg-[#4a76a8] text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Войти через VK
        </button>
      </div>
    </div>
  );
}