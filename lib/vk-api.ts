export async function callVKAPIDirect(method: string, params: any = {}) {
  params.method = method;

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