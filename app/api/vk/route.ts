import { NextRequest, NextResponse } from 'next/server';

// Сервисный ключ (не секретный, безопасно для клиента)
const SERVICE_KEY = 'f5dcebeef5dcebeef5dcebeed3f69f636dff5dcf5dcebee9f4263bce58e36ec456abcc5';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const method = searchParams.get('method');
  
  // Используем сервисный ключ
  const accessToken = SERVICE_KEY;
  const version = '5.131';

  if (!method) {
    return NextResponse.json({ error: 'Missing method' }, { status: 400 });
  }

  // Собираем параметры
  const params: any = {};
  searchParams.forEach((value, key) => {
    if (!['method'].includes(key)) {
      params[key] = value;
    }
  });

  params.access_token = accessToken;
  params.v = version;

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');

  try {
    const response = await fetch(`https://api.vk.com/method/${method}?${queryString}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}