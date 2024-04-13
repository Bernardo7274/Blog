import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { apiRequest } from '@/libs/axios-api';

export const authOptions: NextAuthOptions = {
   providers: [
      GoogleProvider({
         clientId: process.env.NEXT_PUBLIC_GOOGLE_ID || '',
         clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET || '',
      }),
   ],
   pages: {
      signOut: '/',
      error: '/',
   },
   callbacks: {
      async signIn(data: any) {
         if (
            data?.account?.id_token &&
            data?.account?.provider === 'google' &&
            data.user
         ) {
            const auth = await apiRequest.login({ googleToken: data.account?.id_token });
            if (auth) {
               return true as any;
            }
         }
         return false;
      },
      async jwt(token: any): Promise<any> {
         if (token) {
            token;
         }
         return token as any;
      },
      async session(session: any) {
         return session as any;
      },
   },
};
