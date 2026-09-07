'use client';

import { useEffect, useState } from 'react';
import { callVKAPIDirect } from '@/lib/vk-api';

export default function MusicTab() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMusic = async () => {
      const music = await callVKAPIDirect('audio.get', {
        count: 50,
      });
      if (music?.items) {
        setTracks(music.items);
      } else {
        setError('Не удалось загрузить музыку');
      }
      setLoading(false);
    };
    loadMusic();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded shadow max-w-2xl mx-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Моя музыка</h2>
        </div>
        {error ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-4xl mb-2">🎵</p>
            <p>{error}</p>
          </div>
        ) : (
          tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => setPlaying(playing === track.id ? null : track.id)}
              className={`flex items-center gap-4 p-3 border-b hover:bg-gray-50 cursor-pointer ${
                playing === track.id ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-2xl">{playing === track.id ? '⏸️' : '▶️'}</span>
              <div className="flex-1">
                <p className="font-medium">{track.title}</p>
                <p className="text-sm text-gray-500">{track.artist}</p>
              </div>
              <span className="text-sm text-gray-400">
                {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}