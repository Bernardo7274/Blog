'use client';
import React, { useState } from 'react';
import EditNoteIcon from '@mui/icons-material/EditNote';

import { UsersDetails } from '@/components/common/modals/details/UsersDetails';

import { IUser } from '@/interfaces';

interface Props {
   user: IUser;
}

export const UserDetailsEditable = ({ user }: Props) => {
   const [isOpen, setIsOpen] = useState<boolean>(false);

   if (!isOpen)
      return (
         <button>
            <EditNoteIcon onClick={() => setIsOpen(true)} />
         </button>
      );

   return (
      <UsersDetails closeModal={() => setIsOpen(false)} action={'edit'} data={user} />
   );
};
