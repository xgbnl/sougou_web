// Next Imports
import { type NextRequest, NextResponse } from 'next/server'

// NextAuth Imports
import type { Session } from 'next-auth'

// Lib Imports
import { auth } from '@/libs/auth'

// Config Imports
import type { Locale } from '@/configs/i18n'
import { i18n } from '@/configs/i18n'

// Util Imports
import { getLocalizedUrl } from '@utils/i18n'

// Type Imports
import { HttpErrorBoundary } from '@/libs/http/types'

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const {
    nextUrl: { pathname },
    url
  } = request

  // Check if the pathname matches any error page pattern
  // Extract the last segment of the path (e.g., 'unauthenticated' from '/zh/unauthenticated')
  const lastSegment: string = pathname.substring(pathname.lastIndexOf('/') + 1)

  if (isErrorPage(lastSegment)) {
    return NextResponse.next()
  }

  const session: Session | null = await auth()
  const guest: boolean = !session?.user?.token
  const isAuthPage: boolean = pathname.endsWith('/login')

  if (isAuthPage && !guest) {
    return NextResponse.redirect(new URL(`/`, url))
  }

  if (guest && !isAuthPage) {
    const loginPage: string = getLocalizedUrl('login', getLang(pathname))

    return NextResponse.redirect(new URL(loginPage, url))
  }

  return NextResponse.next()
}

function isErrorPage(value: string): value is HttpErrorBoundary {
  return (
    value === HttpErrorBoundary.NOTFOUND ||
    value === HttpErrorBoundary.UNAUTHENTICATED ||
    value === HttpErrorBoundary.UNAUTHORIZED
  )
}

function getLang(pathName: string): Locale {
  const locales: RegExpMatchArray | null = pathName.match(/^\/([a-z]{2})(\/|$)/)

  return i18n.locales.includes(locales?.[1] as Locale) ? (locales?.[1] as Locale) : i18n.defaultLocale
}

export const config: { matcher: string[] } = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|zh/images|en/images).*)']
}
