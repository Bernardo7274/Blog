/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import ClearIcon from '@mui/icons-material/Clear';

import { url } from '@/libs/utils/url';
import { apiRequest } from '@/libs/axios-api';
import jwt from 'jsonwebtoken';
import { ImageComponent } from '@/components/common/ImageComponent';
import Link from 'next/link';

interface LinkItem {
   label: string;
   path: string;
   action: () => void;
}

export const Header = () => {
   const router = useRouter();
   const pathname = usePathname();
   const { data: session } = useSession();
   const [showMenu, setShowMenu] = useState(false);
   const handleToggleMenu = () => {
      setShowMenu(!showMenu);
   };

   const handleSignOut = async () => {
      deleteCookie('nova-access-token', {
         path: '/',
         sameSite: 'lax',
         secure: process.env.NODE_ENV !== 'development',
      });
      signOut();
   };

   const links: LinkItem[] = [
      {
         label: 'Principal',
         path: url.home(),
         action: () => router.push(url.home()),
      },
      {
         label: 'Categorías',
         path: url.posts(),
         action: () => router.push(url.posts()),
      },
      {
         label: 'Administración',
         path: url.adminPosts(),
         action: () => router.push(url.adminPosts()),
      },
   ];

   // next-auth need this for authenticate with external nova-up api
   useEffect(() => {
      (async () => {
         const token = getCookie('nova-access-token');
         if (session && !token) {
            const auth = await apiRequest.login({
               googleToken: (session as any)?.token?.token?.account?.id_token,
            });
            if (auth) {
               setCookie('nova-access-token', auth, {
                  httpOnly: false,
                  secure: process.env.NODE_ENV !== 'development',
                  path: '/',
                  maxAge: 60 * 60 * 24 * 7,
                  sameSite: 'lax',
               });
            } else {
               signOut();
            }
         }
      })();
   }, [session]);

   useEffect(() => {
      const token = getCookie('nova-access-token');
      if (token) {
         try {
            const decoded = jwt.decode(String(token)) as any;
            const now = Math.floor(Date.now() / 1000);

            if (decoded && decoded.exp && now >= decoded.exp) {
               throw new Error('Token expired');
            } else if (!decoded) {
               throw new Error('Invalid token');
            }
         } catch {
            handleSignOut();
         }
      }

      const cookieError = getCookie('next-auth.session-token.0');

      if (cookieError) {
         for (let i = 0; i < 10; i++) {
            deleteCookie(`next-auth.session-token.${i}`, {
               path: '/',
               sameSite: 'lax',
               secure: process.env.NODE_ENV !== 'development',
            });
         }
      }

      router.prefetch(url.home());
      router.prefetch(url.posts());

      if (token) {
         router.prefetch(url.adminPosts());
      }
   }, [pathname, session]);

   return (
      <>
         <div className="header">
            <div className="header__logo">
               <Link href={url.home()}>
                  <ImageComponent
                     src={'/assets/images/logo.png'}
                     alt="logo"
                     w={160}
                     h={90}
                  />
               </Link>
            </div>
            <div className="header__nav">
               <div className="normal__mode">
                  <ul>
                     {links.map((link) =>
                        link.path.includes('admin') && !session ? null : (
                           <Link
                              href={link.path}
                              key={link.label}
                              className={
                                 pathname.split('/')[1] === link.path.split('/')[1]
                                    ? 'border-b'
                                    : ''
                              }>
                              {link.label}
                           </Link>
                        )
                     )}

                     {!session && (
                        <li onClick={() => signIn('google')}>Iniciar sesión</li>
                     )}
                     {session && <li onClick={() => handleSignOut()}>Cerrar sesión</li>}
                  </ul>
               </div>
               <div className="hamburger__mode" onClick={handleToggleMenu}>
                  <ImageComponent
                     src={'/svg/hamburger-menu.svg'}
                     alt="what"
                     w={30}
                     h={30}
                  />
               </div>
            </div>
         </div>
         {showMenu && (
            <div className="hamburger-menu">
               <div className="flex justify-end mb-2">
                  <ClearIcon onClick={handleToggleMenu} />
               </div>
               <ul>
                  {links.map((link) =>
                     link.path.includes('admin') && !session ? null : (
                        <Link
                           key={link.label}
                           href={link.path}
                           className={
                              pathname.split('/')[1] === link.path.split('/')[1]
                                 ? 'bg-[--primary-color] text-white'
                                 : ''
                           }
                           onClick={handleToggleMenu}>
                           {link.label}
                        </Link>
                     )
                  )}
                  {!session && (
                     <li
                        onClick={() => {
                           signIn('google');
                           setShowMenu(false);
                        }}>
                        Iniciar sesión
                     </li>
                  )}
                  {session && (
                     <li
                        onClick={() => {
                           handleSignOut();
                           setShowMenu(false);
                        }}>
                        Cerrar sesión
                     </li>
                  )}
               </ul>
            </div>
         )}
      </>
   );
};
