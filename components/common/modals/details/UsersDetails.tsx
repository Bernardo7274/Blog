'use client';

import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { toast } from 'react-hot-toast';

import { CustomButton } from '@/components/CustomInputs/CustomButton';
import { CustomInputText } from '@/components/CustomInputs/CustomInputText';
import { CustomSelect } from '@/components/CustomInputs/CustomSelect';

import { Error } from '@/components/alerts/Error';
import MutateUsersContext from '@/context/MutateUsersContext';

import { ICatalogGen, IUser } from '@/interfaces';
import { apiRequest } from '@/libs/axios-api';

interface Props {
   closeModal: () => void;
   action: 'create' | 'edit';
   data?: any;
}

export const UsersDetails = ({ closeModal, action, data = {} as IUser }: Props) => {
   const { setUsers } = useContext(MutateUsersContext);

   const [user, setUser] = useState<IUser>(data as IUser);
   const [departments, setDepartments] = useState<ICatalogGen[]>([]);
   const [roles, setRoles] = useState<ICatalogGen[]>([]);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const fetchUsers = async (token: string) => (await apiRequest.getUSers(token)) || [];

   const handleSaveUser = async () => {
      setIsLoading(() => true);
      const token = getCookie('nova-access-token')?.toString() || '';
      if (action === 'create') {
         const save = (await apiRequest.newUser(token, user as any)) as IUser;

         if (save && !save.error) {
            const users = (await fetchUsers(token)) as IUser[];
            setUsers(users);
            toast.success(`Se ha creado el usuario ${save.email}`);

            closeModal();
            return;
         }

         toast.error('Error al crear usuario, verifique el campo email');
      } else {
         const save = await apiRequest.putUser(token, user as any);

         if (save && !save.error) {
            const users = await fetchUsers(token);
            setUsers(users);
            toast.success(`Se ha actualizado el usuario ${save.email}`);

            closeModal();
            return;
         }

         toast.error('Error al guardar, verifique el campo email');
      }
      setIsLoading(() => false);
   };

   const handleChangueText = (e: ChangeEvent<HTMLInputElement>) => {
      setUser((prev: any) => ({ ...(prev || {}), [e.target.name]: e.target.value }));
   };

   const handleChangueValue = (attribute: string, value: any) => {
      setUser((prev: any) => ({ ...(prev || {}), [attribute]: value }));
   };

   useEffect(() => {
      (async () => {
         const departments = await apiRequest.getDepartments();
         const roles = await apiRequest.getRoles();

         setDepartments(() => departments);
         setRoles(() => roles);
      })();
   }, []);

   return (
      <div className="modal-container">
         <div className="modal">
            <div className="modal__title">
               {action === 'create' ? 'Nuevo usuario' : 'Editar usuario'}
            </div>

            <div className="modal__control">
               <CustomInputText
                  label="Email"
                  attributeToChangue="email"
                  placeholder="Email"
                  value={user?.email || ''}
                  onChangueValue={handleChangueText}
               />

               <div className="flex justify-between">
                  <span>Departamento</span>
                  <CustomSelect
                     attributeToChangue="department"
                     options={departments}
                     defaultOption={user?.department as any}
                     onChangueValue={handleChangueValue}
                  />
               </div>

               <div className="flex justify-between">
                  <span>Rol</span>
                  <CustomSelect
                     attributeToChangue="role"
                     options={roles}
                     defaultOption={user?.role as any}
                     onChangueValue={handleChangueValue}
                  />
               </div>
            </div>

            <div className="modal__body">
               <div>
                  <CustomButton
                     title="Cancelar"
                     handleClick={closeModal}
                     containerStyles="btn-secondary mr-5"
                  />

                  <CustomButton
                     title="Guardar"
                     handleClick={handleSaveUser}
                     containerStyles="btn-primary"
                     isLoading={isLoading}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};
