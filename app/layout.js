import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider, ModeToggle } from '@/components/theme-provider'
import Footer from '@/components/Footer'
import MonsterPeekaboo from '@/components/MonsterPeekaboo'

/**
 * Root layout component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Root layout
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('ui-theme');
                let theme;
                if (savedTheme) {
                  theme = savedTheme;
                } else {
                  // No saved preference, use system preference
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider defaultTheme="system">
          <Toaster position="top-center" />
          {children}
          <Footer />
          <ModeToggle />
          <MonsterPeekaboo />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'Cash Money - Get Your Loan Today',
  description: 'Quick and easy payday, personal, and installment loans. Get the cash you need today.',
}