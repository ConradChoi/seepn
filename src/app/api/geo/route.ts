export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const DEFAULT_GEO = { country_code: 'KR', country_name: '대한민국' };

export async function GET() {
  try {
    const res = await fetch('https://ipapi.co/json/', {
      // 10초 타임아웃 유사 구현
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      return new Response(JSON.stringify(DEFAULT_GEO), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          // 30분 캐시 (브라우저), 30분 CDN 공유 캐시
          'Cache-Control': 'public, max-age=1800, s-maxage=1800',
        },
      });
    }

    const data = await res.json();
    const payload = {
      country_code: data?.country_code || DEFAULT_GEO.country_code,
      country_name: data?.country_name || DEFAULT_GEO.country_name,
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800',
      },
    });
  } catch {
    return new Response(JSON.stringify(DEFAULT_GEO), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800',
      },
    });
  }
}


