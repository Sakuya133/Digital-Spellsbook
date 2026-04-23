import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Book of All Knowing',
  description: 'A digital spellbook for spellcasters.',
}

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/spells', label: 'Spells' },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
            <div className="flex items-center justify-between py-4">
              <Link
                href="/"
                className="text-lg font-semibold tracking-[0.2em] text-amber-200"
              >
                BOOK OF ALL KNOWING
              </Link>

              <nav className="flex items-center gap-5 text-sm text-zinc-300">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-amber-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="flex-1 py-10">{children}</main>
        </div>
      </body>
    </html>
  )
}