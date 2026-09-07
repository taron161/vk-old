'use client';

const menuItems = [
  { id: 'profile', icon: '👤', label: 'Моя страница' },
  { id: 'news', icon: '📰', label: 'Новости' },
  { id: 'messages', icon: '✉️', label: 'Сообщения' },
  { id: 'friends', icon: '👥', label: 'Друзья' },
  { id: 'music', icon: '🎵', label: 'Музыка' },
  { id: 'video', icon: '🎬', label: 'Видео' },
];

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  user 
}: { 
  activeTab: string; 
  onTabChange: (tab: string) => void;
  user: any;
}) {
  return (
    <div className="w-52 bg-white border-r border-gray-200 h-full flex flex-col select-none">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-[#4a76a8]">ВКонтакте</h1>
        <p className="text-xs text-gray-500">2013 edition</p>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
              activeTab === item.id
                ? 'bg-[#4a76a8] text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {user?.photo_200 ? (
            <img src={user.photo_200} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          )}
          <div>
            <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}