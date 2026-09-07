'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProfileTab from '@/components/tabs/ProfileTab';
import NewsTab from '@/components/tabs/NewsTab';
import MessagesTab from '@/components/tabs/MessagesTab';
import FriendsTab from '@/components/tabs/FriendsTab';
import MusicTab from '@/components/tabs/MusicTab';
import VideoTab from '@/components/tabs/VideoTab';
import { getTokenFromUrl, redirectToOAuth } from '@/lib/vk';
import { callVKAPIDirect } from '@/lib/vk-api';

export default function Home() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [showAuthButton, setShowAuthButton] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const urlToken = getTokenFromUrl();
      if (urlToken) {
        window.location.hash = '';
      }

      const savedToken = localStorage.getItem('vk_token');
      if (savedToken) {
        const profile = await callVKAPIDirect('users.get', {
          fields: 'photo_200,status,online',
        });
        if (profile?.[0]) {
          setUser(profile[0]);
          setIsAuth(true);
          return;
        }
      }

      setShowAuthButton(true);
    };

    initAuth();
  }, []);

  if (showAuthButton && !isAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f2f5]">
        <div className="text-center">
          <p className="text-4xl mb-4">🔐</p>
          <p className="text-gray-500 mb-4">Войдите через VK</p>
          <button
            onClick={redirectToOAuth}
            className="bg-[#4a76a8] text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Войти через VK
          </button>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f2f5]">
        <p className="text-gray-500">Загрузка...</p>
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