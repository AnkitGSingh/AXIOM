import type { Metadata } from 'next';
import { Orbitron, Rajdhani, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({ 
  subsets: ['latin'], 
  variable: '--font-orbitron' 
});

const rajdhani = Rajdhani({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'], 
  variable: '--font-rajdhani' 
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-jetbrains' 
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ankitgsingh.vercel.app'),
  title: 'Ankit Singh — AI Engineer & Full Stack Developer',
  description: "Portfolio of Ankit Singh, MSc AI graduate and Automation Engineer at AdTecher Sheffield. Specialising in AI systems, full-stack development, and 3D web experiences.",
  openGraph: {
    title: 'Ankit Singh — AXIOM Portfolio',
    description: "AI engineer. Full-stack developer. Iron Man fan. See what I've built.",
    url: 'https://ankitgsingh.vercel.app',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#C9A84C" />
      </head>
      <body suppressHydrationWarning className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable} antialiased bg-[#080808]`} style={{ background: '#080808', color: '#fff' }}>
        {children}
      </body>
    </html>
  );
}
