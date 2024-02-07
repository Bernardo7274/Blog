/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { use, useEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { ConfirmationModal } from '@/components/common/modals/ConfirmationModal';
import { UserDetailsEditable } from '@/components/common/modals/details/UserDetailsEditable';
import { IUser } from '@/interfaces';

interface Props {
   users: IUser[];
   data: any[];
   itemsPage: number;
}

export const Table = ({ users, data, itemsPage }: Props) => {
   const [currentPage, setCurrentPage] = useState(1);
   const headers = Object.keys(data[0] || {});
   const [pages, setPages] = useState(1);

   useEffect(() => {
      const currentPages = Math.ceil(data.length / (itemsPage || 1));
      setPages(currentPages);

      if (currentPage > currentPages) {
         setCurrentPage(currentPages);
      }
   }, [data, itemsPage]);

   const handleNextPage = () => {
      if (currentPage >= pages) return;
      setCurrentPage((prevPage) => Math.min(prevPage + 1, data.length));
   };

   const handlePreviusPage = () => {
      if (currentPage <= 1) return;
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
   };

   return (
      <div className="admin-container__table">
         <table>
            <thead>
               <tr>
                  {headers.map((header, index) =>
                     header === 'id' ? null : <th key={index}>{header}</th>
                  )}
                  <th />
                  <th />
               </tr>
            </thead>
            <tbody>
               {data
                  .slice((currentPage - 1) * itemsPage, currentPage * itemsPage)
                  .map((row, index) => (
                     <tr key={index}>
                        {headers.map((header, index) =>
                           header === 'id' ? null : <td key={index}>{row[header]}</td>
                        )}
                        <td>
                           <UserDetailsEditable
                              user={
                                 users.find((user) => user.id === row.id) || ({} as any)
                              }
                           />
                        </td>
                        <td>
                           <ConfirmationModal
                              title={`¿Seguro que quieres eliminar "${
                                 row['Titulo'] || row['Email']
                              }?"`}
                              target={row['id']}
                              fetcher="users">
                              <DeleteForeverIcon />
                           </ConfirmationModal>
                        </td>
                     </tr>
                  ))}
            </tbody>
         </table>
         <div className="table-control">
            <button onClick={handlePreviusPage}>
               <ArrowBackIosIcon />
            </button>
            {Array.from({ length: pages || 1 }, (_, i) => (
               <button
                  key={`page-${i + 1}`}
                  onClick={() => setCurrentPage(() => i + 1)}
                  className={currentPage === i + 1 ? 'border-b border-black' : ''}>
                  {i + 1}
               </button>
            ))}
            <button onClick={handleNextPage}>
               <ArrowForwardIosIcon />
            </button>
         </div>
      </div>
   );
};
