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

  // Rotas públicas (ex: login, signup, landpage se houvesse)
  const isAuthPage = pathname === '/auth';

  // Buscar sessão do better-auth
  // Usamos fetch manual pois authClient do react não funciona no middleware (edge)
  const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/get-session`, {
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
  });

  const session = await sessionRes.json();
  const hasSession = !!session?.user;

  // Se não tem sessão e não está na página de auth, redireciona para /auth
  if (!hasSession && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Se tem sessão e está na página de auth, redireciona para o dashboard
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Proteção de rotas ADMIN
  if (pathname.startsWith('/admin')) {
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
