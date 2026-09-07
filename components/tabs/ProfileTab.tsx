'use client';

import { useEffect, useState } from 'react';
import { callVKAPIDirect } from '@/lib/vk-api';

export default function ProfileTab({ user }: { user: any }) {
  const [friendsCount, setFriendsCount] = useState(0);

  useEffect(() => {
    const loadFriends = async () => {
      const friends = await callVKAPIDirect('friends.get', {
        fields: 'photo_100,online',
        order: 'name',
      });
      if (friends) {
        setFriendsCount(friends.count || friends.length || 0);
      }
    };
    loadFriends();
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white rounded shadow p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          {user?.photo_200 ? (
            <img src={user.photo_200} alt="" className="w-20 h-20 rounded-full" />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full" />
          )}
          <div>
            <h2 className="text-xl font-bold">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-gray-500">{user?.online ? 'Online' : 'Offline'}</p>
            {user?.status && <p className="text-sm mt-2">{user.status}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold">{friendsCount}</p>
            <p className="text-sm text-gray-500">друзей</p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold">{user?.counters?.followers || 0}</p>
            <p className="text-sm text-gray-500">подписчиков</p>
          </div>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-2xl font-bold">{user?.counters?.photos || 0}</p>
            <p className="text-sm text-gray-500">фото</p>
          </div>
        </div>
      </div>
    </div>
  );
}