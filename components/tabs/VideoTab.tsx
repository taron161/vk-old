'use client';

import { useEffect, useState } from 'react';
import { callVKAPIDirect } from '@/lib/vk-api';

export default function VideoTab() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVideos = async () => {
      const videoList = await callVKAPIDirect('video.get', {
        count: 20,
        extended: 1,
      });
      if (videoList?.items) {
        setVideos(videoList.items);
      } else {
        setError('Не удалось загрузить видео');
      }
      setLoading(false);
    };
    loadVideos();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded shadow p-6 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold mb-4">Видео</h2>
        {error ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-4xl mb-2">🎬</p>
            <p>{error}</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-4xl mb-2">🎬</p>
            <p>Видео нет</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="border rounded p-3 hover:bg-gray-50">
                {video.image && (
                  <img src={video.image} alt="" className="w-full h-40 object-cover rounded mb-2" />
                )}
                <p className="font-medium truncate">{video.title}</p>
                <p className="text-sm text-gray-500">
                  {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}