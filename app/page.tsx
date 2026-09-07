'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProfileTab from '@/components/tabs/ProfileTab';
import NewsTab from '@/components/tabs/NewsTab';
import MessagesTab from '@/components/tabs/MessagesTab';
import FriendsTab from '@/components/tabs/FriendsTab';
import MusicTab from '@/components/tabs/MusicTab';
import VideoTab from '@/components/tabs/VideoTab';
import { callVKAPIDirect } from '@/lib/vk-api';

export default function Home() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      // Пробуем получить текущего пользователя
      const profile = await callVKAPIDirect('users.get', {
        user_ids: '728799672', // ID из консоли VK
        fields: 'photo_200,status,online',
      });
      
      if (profile?.[0]) {
        setUser(profile[0]);
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, []);

  if (isLoading) {
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