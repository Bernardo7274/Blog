import '@/app/styles/globals.css';

import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import { Header } from '@/components/common/Header';
import NextAuthSessionProvider from '@/providers/sessionProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
   children,
   params: { session, ...params },
}: {
   children: React.ReactNode;
   params: any;
}) {
   return (
      <html lang="en">
         <body className={inter.className}>
            <NextAuthSessionProvider>
               <Header />
               {children}
               <Toaster position="top-center" reverseOrder={false} />
            </NextAuthSessionProvider>
         </body>
      </html>
   );
}
