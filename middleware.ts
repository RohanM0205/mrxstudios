// middleware.ts — project root (next to package.json)
// Protects all /admin/* routes. Unauthenticated visitors are redirected to /admin/login.

import { createServerClient } from '@supabase/ssr'
import { NextResponse }        from 'next/server'
import type { NextRequest }    from 'next/server'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Allow /admin/login through always; ignore non-admin routes
  if (!path.startsWith('/admin') || path === '/admin/login') {
    return NextResponse.next()
  }

  // ── Build a mutable response that we'll return at the end ──
  // Must be created this way so refreshed auth cookies get forwarded to the browser.
  let response = NextResponse.next({
    request: { headers: req.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL      ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Step 1: write cookies onto the request (needed for downstream reads)
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          )
          // Step 2: rebuild response so the updated cookies reach the browser
          response = NextResponse.next({
            request: { headers: req.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ── Use getUser() not getSession() ──
  // getSession() reads the JWT locally without server verification and can
  // return a stale/spoofed session. getUser() always hits Supabase auth server.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('from', path)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}