import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const host = request.headers.get('host') || ''
    let tenant = 'default'
    if (!host.startsWith('localhost')) {
        const hostname = host.split(':')[0]
        const parts = hostname.split('.')
        if (parts.length > 2) tenant = parts[0]
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-tenant', tenant)

    return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
