'use client';

import { useEffect, useState } from 'react';
import { callVKAPIDirect } from '@/lib/vk-api';

export default function MessagesTab() {
  const [dialogues, setDialogues] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeDialog, setActiveDialog] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDialogs = async () => {
      const dialogs = await callVKAPIDirect('messages.getConversations', {
        count: 20,
        extended: 1,
      });
      if (dialogs?.items) {
        setDialogues(dialogs.items);
      }
      setLoading(false);
    };
    loadDialogs();
  }, []);

  const openDialog = async (dialog: any) => {
    setActiveDialog(dialog);
    const history = await callVKAPIDirect('messages.getHistory', {
      peer_id: dialog.conversation.peer.id,
      count: 50,
      extended: 1,
    });
    if (history?.items) {
      setMessages(history.items.reverse());
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeDialog) return;
    
    await callVKAPIDirect('messages.send', {
      peer_id: activeDialog.conversation.peer.id,
      message: newMessage,
      random_id: Math.floor(Math.random() * 1000000),
    });
    setNewMessage('');
    
    const history = await callVKAPIDirect('messages.getHistory', {
      peer_id: activeDialog.conversation.peer.id,
      count: 50,
      extended: 1,
    });
    if (history?.items) {
      setMessages(history.items.reverse());
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center text-gray-500">Загрузка...</div>;
  }

  return (
    <div className="flex h-full">
      <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto shrink-0">
        {dialogues.length === 0 ? (
          <div className="p-6 text-center text-gray-500"><p>Нет диалогов</p></div>
        ) : (
          dialogues.map((dialog) => (
            <div
              key={dialog.conversation.peer.id}
              onClick={() => openDialog(dialog)}
              className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                activeDialog?.conversation?.peer?.id === dialog.conversation.peer.id ? 'bg-gray-100' : ''
              }`}
            >
              <p className="font-medium">
                {dialog.conversation.peer.type === 'user'
                  ? 'Пользователь'
                  : dialog.conversation.peer.type === 'chat'
                  ? dialog.conversation.chat_settings?.title || 'Чат'
                  : 'Группа'}
              </p>
              {dialog.last_message && (
                <p className="text-sm text-gray-500 truncate">
                  {dialog.last_message.text || '📎 Вложение'}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {activeDialog ? (
          <>
            <div className="p-3 border-b bg-white">
              <p className="font-medium">
                {activeDialog.conversation.peer.type === 'user'
                  ? 'Диалог'
                  : activeDialog.conversation.chat_settings?.title || 'Чат'}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded max-w-[70%] ${
                    msg.out ? 'bg-[#4a76a8] text-white ml-auto' : 'bg-gray-100'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 p-2 border rounded"
                  placeholder="Введите сообщение..."
                />
                <button
                  onClick={handleSend}
                  className="bg-[#4a76a8] text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Отправить
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Выберите диалог
          </div>
        )}
      </div>
    </div>
  );
}