import bridge from '@vkontakte/vk-bridge';

export const vk = bridge;

const APP_ID = 54757507;
let savedToken: string | null = null;

// Получить токен через VK Bridge
export async function getAuthToken(): Promise<string | null> {
  if (savedToken) return savedToken;

  try {
    const token = await vk.send('VKWebAppGetAuthToken', {
      app_id: APP_ID,
      scope: 'friends,photos,video,wall,offline,status,groups',
    });
    savedToken = token.access_token;
    localStorage.setItem('vk_token', token.access_token);
    return savedToken;
  } catch (error) {
    console.error('Ошибка VK Bridge:', error);
    return null;
  }
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

export { APP_ID };