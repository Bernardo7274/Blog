/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useContext, useEffect, useState } from 'react';

import { Table } from '@/components/common/Table';
import { LoadingProgress } from '@/components/common/LoadingProgress';

import { apiRequest } from '@/libs/axios-api';
import { getCookie } from 'cookies-next';
import { IUser } from '@/interfaces';
import MutateUsersContext from '@/context/MutateUsersContext';

export default function AdminUsers() {
   const { users, setUsers } = useContext(MutateUsersContext);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   useEffect(() => {
      (async () => {
         const token = getCookie('nova-access-token');
         const users = await apiRequest.getUSers(String(token));
         setUsers(users);
         setIsLoading(() => false);
      })();
   }, []);

   return (
      <>
         {isLoading && <LoadingProgress />}
         {!isLoading && users && (
            <div className="admin-container">
               <Table
                  users={users}
                  data={
                     users?.length
                        ? users?.map((user: IUser) => {
                             return {
                                id: user.id,
                                Email: user.email,
                                Departamento: user.department.name,
                                'Tipo de usuario': user.role.name,
                             };
                          })
                        : []
                  }
                  itemsPage={7}
               />
            </div>
         )}
      </>
   );
}
