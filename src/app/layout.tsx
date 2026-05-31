import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import { GSAPProvider }     from '@/providers/GSAPProvider'
import { LenisProvider }    from '@/providers/LenisProvider'
import { TransitionRouter } from 'next-transition-router'
import Nav            from '@/components/layout/Nav'
import Footer         from '@/components/layout/Footer'
import Preloader      from '@/components/layout/Preloader'
import PageTransition from '@/components/layout/PageTransition'
import RouteLoader    from '@/components/layout/RouteLoader'
import MobileBlocker  from '@/components/layout/MobileBlocker'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-space',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300','400','500'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Darpan — Video Editing Agency',
  description: 'Darpan — video editing for creators, coaches, brands. Your vision, perfectly reflected.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-bg-base text-accent font-body overflow-x-hidden max-md:overflow-hidden max-md:h-[100svh]">
        <MobileBlocker />
        <div className="hidden md:block">
          <GSAPProvider>
            <LenisProvider>
              <TransitionRouter>
                <Preloader />
                <Nav />
                <RouteLoader />
                <PageTransition>
                  <main>{children}</main>
                </PageTransition>
                <Footer />
              </TransitionRouter>
            </LenisProvider>
          </GSAPProvider>
        </div>
      </body>
    </html>
  )
}
