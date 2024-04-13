'use client';
import React, { HtmlHTMLAttributes, Ref, useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ImageComponent } from '../common/ImageComponent';

export const InputSearch = () => {
   const router = useRouter();
   const path = usePathname();

   const handleSearchChangue = (search: string) => {
      router.replace(`${path}?search=${search}`);
   };

   const handleActiveFocus = () => {
      const search = document.querySelector<HTMLInputElement>('.search-input');
      search?.focus();
   };

   const handleSearchFocus = () => {
      const search = document.querySelector<HTMLInputElement>('.search-input');
      const categories = document.querySelector<HTMLInputElement>(
         '.categories-container'
      );
      if (search && categories) {
         search.focus();
         categories.classList.add('hidden-categories');
      }
   };

   const handleSearchBlur = () => {
      const search = document.querySelector<HTMLInputElement>('.search-input');
      const categories = document.querySelector('.categories-container');

      if (search && categories) {
         search.blur();
         categories.classList.remove('hidden-categories');
      }
   };

   useEffect(() => {
      const search = document.querySelector<HTMLInputElement>('.search-input');
      if (search) {
         search.addEventListener('focus', handleSearchFocus);
         search.addEventListener('blur', handleSearchBlur);
      }

      return () => {
         if (search) {
            search.removeEventListener('focus', handleSearchFocus);
            search.removeEventListener('blur', handleSearchBlur);
         }
      };
   }, []);

   return (
      <div className="search-container">
         <i className="icon-left">
            <ImageComponent src="/svg/Student.svg" w={24} h={24} alt="student-svg" />
         </i>
         <input
            type="text"
            className="search-input"
            placeholder="Buscar..."
            onChange={(e) => handleSearchChangue(e.target.value)}
         />
         <i className="icon-right" onClick={handleActiveFocus}>
            <SearchIcon />
         </i>
      </div>
   );
};
