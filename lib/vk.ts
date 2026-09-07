import bridge from '@vkontakte/vk-bridge';

export const vk = bridge;

const APP_ID = 54757507;
let savedToken: string | null = null;

// Получить токен через VK Bridge (для Mini App)
export async function getAuthToken(): Promise<string | null> {
  if (savedToken) return savedToken;

  try {
    const token = await vk.send('VKWebAppGetAuthToken', {
      app_id: APP_ID,
      scope: 'friends,offline',
    });
    savedToken = token.access_token;
    localStorage.setItem('vk_token', token.access_token);
    return savedToken;
  } catch (error) {
    console.log('VK Bridge недоступен, используем OAuth');
    return null;
  }
}

// Получить токен из URL (после OAuth редиректа)
export function getTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash;
  const match = hash.match(/access_token=([^&]+)/);
  
  if (match) {
    savedToken = match[1];
    localStorage.setItem('vk_token', match[1]);
    return match[1];
  }
  
  return null;
}

// Получить сохраненный токен
export function getSavedToken(): string | null {
  if (savedToken) return savedToken;
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('vk_token');
    if (token) {
      savedToken = token;
      return token;
    }
  }
  
  return null;
}

// Очистить токен
export function clearToken() {
  savedToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vk_token');
  }
}

// Прямой OAuth редирект
export function redirectToOAuth() {
  const redirectUri = window.location.origin;
  const scope = 'friends,photos,audio,video,wall,messages,offline,status,groups';
  const authUrl = `https://oauth.vk.com/authorize?client_id=${APP_ID}&display=page&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&v=5.131`;
  window.location.href = authUrl;
}

export { APP_ID };