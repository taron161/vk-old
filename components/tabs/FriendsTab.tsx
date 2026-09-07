'use client';

import { useEffect, useState } from 'react';
import { callVKAPIDirect } from '@/lib/vk-api';

export default function FriendsTab() {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);

  useEffect(() => {
    const loadFriends = async () => {
      const friendsList = await callVKAPIDirect('friends.get', {
        fields: 'photo_100,online,last_seen',
        order: 'name',
      });
      if (friendsList?.items) {
        setFriends(friendsList.items);
      }
      setLoading(false);
    };
    loadFriends();
  }, []);

  const openFriend = async (friend: any) => {
    const profile = await callVKAPIDirect('users.get', {
      user_ids: friend.id,
      fields: 'photo_200,status,online,last_seen,counters',
    });
    setSelectedFriend(profile?.[0] || null);
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-bold mb-4">Друзья ({friends.length})</h2>
            {friends.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="text-4xl mb-2">👥</p>
                <p>Список друзей пуст</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => openFriend(friend)}
                    className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
                  >
                    {friend.photo_100 ? (
                      <img src={friend.photo_100} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    )}
                    <div>
                      <p className="font-medium">{friend.first_name} {friend.last_name}</p>
                      <p className="text-xs text-gray-500">{friend.online ? 'Online' : 'Offline'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedFriend && (
          <div className="w-72 bg-white rounded shadow p-4 shrink-0">
            <img src={selectedFriend.photo_200} alt="" className="w-20 h-20 rounded-full mx-auto mb-3" />
            <h3 className="text-center font-bold">{selectedFriend.first_name} {selectedFriend.last_name}</h3>
            <p className="text-center text-gray-500 text-sm mb-4">{selectedFriend.status || 'Нет статуса'}</p>
            <button
              onClick={() => setSelectedFriend(null)}
              className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}