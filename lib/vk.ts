import bridge from '@vkontakte/vk-bridge';

export const vk = bridge;

const APP_ID = 54757507;

// Сохраняем токен в памяти
let savedToken: string | null = null;

// Получить токен
export async function getAuthToken(): Promise<string | null> {
  // Если токен уже есть — возвращаем его
  if (savedToken) return savedToken;

  try {
    // Пробуем VK Bridge (для Mini App)
    const token = await vk.send('VKWebAppGetAuthToken', {
      app_id: APP_ID,
      scope: 'friends,photos,audio,video,wall,messages,offline,status,groups',
    });
    savedToken = token.access_token;
    return savedToken;
  } catch (error) {
    console.log('VK Bridge недоступен, пробуем OAuth...');
    
    // Для обычного браузера — OAuth редирект
    const redirectUri = window.location.origin;
    const authUrl = `https://oauth.vk.com/authorize?client_id=${APP_ID}&display=page&redirect_uri=${redirectUri}&scope=friends,photos,audio,video,wall,messages,offline,status,groups&response_type=token&v=5.131`;
    
    window.location.href = authUrl;
    return null;
  }
}

// Получить токен из URL (после OAuth)
export function getTokenFromUrl(): string | null {
  const hash = window.location.hash;
  const match = hash.match(/access_token=([^&]+)/);
  if (match) {
    savedToken = match[1];
    return match[1];
  }
  return null;
}

// Вызов VK API
export async function callVKAPI(method: string, params: any = {}): Promise<any> {
  let token = savedToken;
  
  if (!token) {
    token = getTokenFromUrl();
  }
  
  if (!token) {
    token = await getAuthToken();
  }
  
  if (!token) return null;

  params.access_token = token;
  params.v = '5.131';

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  try {
    const response = await fetch(`https://api.vk.com/method/${method}?${queryString}`);
    const data = await response.json();
    
    if (data.error) {
      console.error('VK API ошибка:', data.error);
      if (data.error.error_code === 5) {
        // Токен недействителен — очищаем
        savedToken = null;
      }
      return null;
    }
    
    return data.response;
  } catch (error) {
    console.error('Ошибка VK API:', error);
    return null;
  }
}

// Получить профиль
export async function getProfile() {
  const users = await callVKAPI('users.get', {
    fields: 'photo_200,status,counters,online,last_seen',
  });
  return users?.[0] || null;
}

// Получить друзей
export async function getFriends() {
  return await callVKAPI('friends.get', {
    fields: 'photo_100,online,last_seen',
    order: 'name',
  });
}

// Получить новости
export async function getNews() {
  return await callVKAPI('newsfeed.get', {
    count: 20,
    filters: 'post,photo',
    return_banned: 0,
  });
}

// Получить диалоги
export async function getDialogs() {
  return await callVKAPI('messages.getConversations', {
    count: 20,
    extended: 1,
  });
}

// Получить сообщения из диалога
export async function getMessages(peerId: number) {
  return await callVKAPI('messages.getHistory', {
    peer_id: peerId,
    count: 50,
    extended: 1,
  });
}

// Отправить сообщение
export async function sendMessage(peerId: number, message: string) {
  return await callVKAPI('messages.send', {
    peer_id: peerId,
    message: message,
    random_id: Math.floor(Math.random() * 1000000),
  });
}

// Поставить лайк
export async function addLike(type: string, ownerId: number, itemId: number) {
  return await callVKAPI('likes.add', {
    type: type,
    owner_id: ownerId,
    item_id: itemId,
  });
}

// Получить музыку
export async function getMusic() {
  return await callVKAPI('audio.get', {
    count: 50,
  });
}

// Получить видео
export async function getVideos() {
  return await callVKAPI('video.get', {
    count: 20,
    extended: 1,
  });
}

// Получить профиль пользователя по ID
export async function getUserById(userId: number) {
  const users = await callVKAPI('users.get', {
    user_ids: userId,
    fields: 'photo_200,status,online,last_seen,counters',
  });
  return users?.[0] || null;
}