'use client';

import { useEffect, useState } from 'react';
import { callVKAPIDirect } from '@/lib/vk-api';

export default function NewsTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      const news = await callVKAPIDirect('newsfeed.get', {
        count: 20,
        filters: 'post,photo',
        return_banned: 0,
      });
      if (news?.items) {
        setPosts(news.items);
      } else {
        setError('Не удалось загрузить новости');
      }
      setLoading(false);
    };
    loadNews();
  }, []);

  const handleLike = async (post: any) => {
    await callVKAPIDirect('likes.add', {
      type: 'post',
      owner_id: post.owner_id,
      item_id: post.post_id,
    });
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Загрузка...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-gray-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white rounded shadow p-8 text-center text-gray-500">
            <p className="text-4xl mb-2">📰</p>
            <p>Новостей нет</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.post_id} className="bg-white rounded shadow p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <div>
                  <p className="font-medium">{post.name || 'Источник'}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.date * 1000).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
              
              {post.text && <p className="mb-3">{post.text}</p>}
              
              <button
                onClick={() => handleLike(post)}
                className="flex items-center gap-2 text-gray-500 hover:text-red-500"
              >
                ❤️ <span>{post.likes?.count || 0}</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}