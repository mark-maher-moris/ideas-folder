import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Collaborative Project Hub',
  description: 'A platform for collaborative projects and idea sharing',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
          footerActionLink: 'text-primary hover:text-primary/90',
        }
      }}
    >
      <html lang="en" className="scroll-smooth">
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full">
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}