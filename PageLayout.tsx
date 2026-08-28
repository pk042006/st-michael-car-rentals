import { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'

interface PageLayoutProps {
  children: ReactNode
  darkHero?: boolean
}

export function PageLayout({ children, darkHero }: PageLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${darkHero ? '' : 'pt-20'}`}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
