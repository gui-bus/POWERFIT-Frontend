import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar arquivos estáticos, APIs internas, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Rotas que não precisam de verificação de sessão no servidor
  // Deixamos o redirecionamento de login para os layouts/páginas (Client-side)
  // para evitar loops causados por discrepâncias de cookies no Edge.
  if (pathname === '/auth') {
    return NextResponse.next();
  }

  // Proteção de rotas ADMIN (Esta sim precisa ser rigorosa)
  if (pathname.startsWith('/admin')) {
    try {
      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/profile`, {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
        cache: 'no-store'
      });

      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile?.data?.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      } else {
        // Se falhar a verificação, por segurança redirecionamos para a home
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Erro ao verificar perfil admin no proxy:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
