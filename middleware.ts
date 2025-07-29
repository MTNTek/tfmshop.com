import { auth } from '@/lib/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!req.auth?.user || req.auth.user.role !== 'ADMIN') {
      return Response.redirect(new URL('/auth/signin', req.url))
    }
  }

  // Protect user account routes
  if (pathname.startsWith('/account')) {
    if (!req.auth?.user) {
      return Response.redirect(new URL('/auth/signin', req.url))
    }
  }

  // Protect checkout routes
  if (pathname.startsWith('/checkout')) {
    if (!req.auth?.user) {
      return Response.redirect(new URL('/auth/signin', req.url))
    }
  }
})

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/checkout/:path*']
}
