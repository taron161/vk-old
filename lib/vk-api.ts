export async function callVKAPIDirect(method: string, params: any = {}) {
  // Сначала пробуем пользовательский токен
  const userToken = localStorage.getItem('vk_token');
  
  params.method = method;
  
  if (userToken) {
    params.user_token = userToken;
  }

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  try {
    const response = await fetch(`/api/vk?${queryString}`);
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