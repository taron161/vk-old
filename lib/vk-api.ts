// Прямые вызовы VK API без VK Bridge
export async function callVKAPIDirect(method: string, params: any = {}) {
  const token = localStorage.getItem('vk_token');
  if (!token) return null;

  params.access_token = token;
  params.v = '5.131';

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  try {
    const response = await fetch(`https://api.vk.com/method/${method}?${queryString}`);
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Ошибка VK API:', error);
    return null;
  }
}