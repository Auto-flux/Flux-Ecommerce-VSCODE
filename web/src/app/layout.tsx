import '@/styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Flux-Ecommerce',
    description: 'Whitelabel ecommerce landing generator',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body className="min-h-dvh antialiased text-gray-100">
                {children}
            </body>
        </html>
    )
}
