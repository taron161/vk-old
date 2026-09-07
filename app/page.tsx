'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProfileTab from '@/components/tabs/ProfileTab';
import NewsTab from '@/components/tabs/NewsTab';
import MessagesTab from '@/components/tabs/MessagesTab';
import FriendsTab from '@/components/tabs/FriendsTab';
import MusicTab from '@/components/tabs/MusicTab';
import VideoTab from '@/components/tabs/VideoTab';
import { getAuthToken, getSavedToken } from '@/lib/vk';
import { callVKAPIDirect } from '@/lib/vk-api';

export default function Home() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      // Пробуем получить токен через VK Bridge
      const bridgeToken = await getAuthToken();
      
      if (bridgeToken) {
        const profile = await callVKAPIDirect('users.get', {
          fields: 'photo_200,status,online',
        });
        
        if (profile?.[0]) {
          setUser(profile[0]);
          setIsAuth(true);
          setIsLoading(false);
          return;
        }
      }

      // Проверяем сохраненный токен
      const savedToken = getSavedToken();
      if (savedToken) {
        const profile = await callVKAPIDirect('users.get', {
          fields: 'photo_200,status,online',
        });
        
        if (profile?.[0]) {
          setUser(profile[0]);
          setIsAuth(true);
          setIsLoading(false);
          return;
        }
      }

      setError('Не удалось авторизоваться. Откройте приложение внутри VK.');
      setIsLoading(false);
    };

    initAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f2f5]">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f2f5]">
        <div className="text-center">
          <p className="text-4xl mb-4">🔐</p>
          <p className="text-gray-500 mb-4">{error || 'Необходима авторизация'}</p>
          <p className="text-sm text-gray-400">
            Откройте приложение через VK: https://vk.ru/app54757507
          </p>
        </div>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab user={user} />;
      case 'news':
        return <NewsTab />;
      case 'messages':
        return <MessagesTab />;
      case 'friends':
        return <FriendsTab />;
      case 'music':
        return <MusicTab />;
      case 'video':
        return <VideoTab />;
      default:
        return <div className="p-6">Раздел в разработке</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        user={user}
      />
      <main className="flex-1 overflow-y-auto">
        {renderTab()}
      </main>
    </div>
  );
}