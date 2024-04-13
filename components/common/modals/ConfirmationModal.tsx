'use client';

import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

import { CustomButton } from '@/components/CustomInputs/CustomButton';
import MutateUsersContext from '@/context/MutateUsersContext';
import MutatePostsContext from '@/context/MutatePostsContext';

import { apiRequest } from '@/libs/axios-api';
import { toast } from 'react-hot-toast';
import { ICatalogGen, IFetcherSelector } from '@/interfaces';

interface Props {
   title: string;
   children: React.ReactNode;
   target: any;
   fetcher: IFetcherSelector;
   extraReloadFunc?: () => void;
}

export const ConfirmationModal = ({
   title,
   children,
   target,
   fetcher,
   extraReloadFunc,
}: Props) => {
   const { setUsers } = useContext(MutateUsersContext);
   const { setPosts } = useContext(MutatePostsContext);
   const [isOpen, setIsOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   if (!isOpen)
      return (
         <button
            id="action-danger"
            className={fetcher === 'delete-asset' ? 'file__delete' : ''}
            onClick={() => setIsOpen(() => true)}>
            {children}
         </button>
      );

   const fetchers = {
      users: async (token: string, id: number) => await apiRequest.deleteUser(token, id),
      posts: async (token: string, id: number) => await apiRequest.deletePost(token, id),
      'delete-asset': async (token: string, id: number) =>
         await apiRequest.deleteAssetsPost(token, id),
   };

   const reload = {
      users: async (token: string) => {
         const users = await apiRequest.getUSers(String(token) as any);
         setUsers(users);
      },
      posts: async (token: string) => {
         const posts = await apiRequest.getPostsCrud(String(token) as any);
         setPosts(posts);
      },
      'delete-asset': () => extraReloadFunc && extraReloadFunc(),
   };

   const handleOnConfirmation = async () => {
      setIsLoading(true);
      const token = getCookie('nova-access-token');

      if (!token) return;

      const response = await fetchers[fetcher](String(token) as any, target);
      if (response) {
         reload[fetcher](String(token) as any);
         toast.success('Se ha eliminado el recurso correctamente');

         setIsOpen(() => false);
      } else {
         toast.error('Ocurrio un error al intentar eliminar el recurso');
      }
      setIsLoading(false);
   };

   return (
      <div className="modal-container">
         <div className="modal">
            <div className="modal__title">{title}</div>
            <div className="modal__body">
               <CustomButton
                  title="Cancelar"
                  handleClick={() => setIsOpen(() => false)}
                  containerStyles="btn-secondary"
               />
               <CustomButton
                  title="Confirmar"
                  handleClick={handleOnConfirmation}
                  containerStyles="btn-primary"
                  isLoading={isLoading}
               />
            </div>
         </div>
      </div>
   );
};
