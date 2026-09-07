// Вставьте ваш сервисный ключ сюда
const SERVICE_KEY = 'f5dcebeef5dcebeef5dcebeed3f69f636dff5dcf5dcebee9f4263bce58e36ec456abcc5';

export async function callVKAPIDirect(method: string, params: any = {}) {
  // Используем сервисный ключ для публичных методов
  params.access_token = SERVICE_KEY;
  params.v = '5.131';

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  try {
    const response = await fetch(`https://api.vk.com/method/${method}?${queryString}`);
    const data = await response.json();
    
    if (data.error) {
      console.error('VK API ошибка:', data.error);
      return null;
    }
    
    return data.response;
  } catch (error) {
    console.error('Ошибка VK API:', error);
    return null;
  }
}