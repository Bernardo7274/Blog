'use client';
import React, { useState } from 'react';
import { UsersDetails } from './UsersDetails';
import { CustomButton } from '@/components/CustomInputs/CustomButton';
import { useRouter } from 'next/navigation';
import { url } from '@/libs/utils/url';
import { IUser } from '@/interfaces';
import Link from 'next/link';

interface Props {
   tabSelector: 'users' | 'posts';
   action: 'create' | 'edit';
}

export const SelectorDetails = ({ tabSelector, action }: Props) => {
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const router = useRouter();

   const isPost = tabSelector === 'posts';

   const handleActionByTabSelector = () => {
      if (isPost) {
         router.push(url.adminPostsEditable(0));
         return;
      } else {
         setIsOpen(() => true);
      }
   };

   if (!isOpen)
      return (
         <Link href={isPost ? url.adminPostsEditable(0) : ''}>
            <CustomButton
               title="Nuevo"
               handleClick={handleActionByTabSelector}
               containerStyles="btn-primary--tab br-left"
            />
         </Link>
      );

   if (isOpen && tabSelector === 'users')
      return <UsersDetails closeModal={() => setIsOpen(false)} action={action} />;
};
