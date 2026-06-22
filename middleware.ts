import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isLoginPage  = request.nextUrl.pathname.startsWith('/login')

  // If Supabase isn't configured, fail open so the app remains accessible
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
    return response
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll:  () => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch {
    // Supabase failed — fail open rather than crash
    return response
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
