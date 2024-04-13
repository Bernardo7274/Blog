'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { CustomButton } from '@/components/CustomInputs/CustomButton';
import { ConfirmationModal } from '@/components/common/modals/ConfirmationModal';
import { ImageComponent } from '@/components/common/ImageComponent';
import { FrameViewerModal } from '@/components/common/modals/FrameViewerModal';

import { urlApi } from '@/libs/utils/url';
import { IPost } from '@/interfaces';

interface Props {
   post: IPost;
}

export const Card = ({ post }: Props) => {
   const router = useRouter();
   const pathname = usePathname();

   const isAproved = post.status === 'aprobado';
   const isPending = post.status === 'pendiente';
   const isRejected = post.status === 'rechazado';

   const handleSolveNavigation = () => {
      if (pathname.includes('admin')) {
         router.push(`/admin/posts/${post.id}`);
      } else {
         router.push(`/posts/${post.id}`);
      }
   };

   return (
      <div className="card">
         <div className="card__body">
            <div className="card__title">{post.title}</div>
            <div className="card__summary">
               <p>{post.summary}</p>
            </div>
            <div>
               {pathname.includes('admin') ? (
                  <div className="flex justify-between flex-col sm:flex-row">
                     <ImageComponent
                        src={
                           isAproved
                              ? '/svg/post-approved.svg'
                              : isRejected
                              ? '/svg/post-canceled.svg'
                              : '/svg/post-pending.svg'
                        }
                        alt="status"
                        w={30}
                        h={30}
                     />
                     <div className="card__body-details__editable">
                        <ConfirmationModal
                           title={`¿Seguro que deseas eliminar el post "${post.title}"?`}
                           target={post.id}
                           fetcher="posts">
                           <CustomButton
                              title="Eliminar"
                              containerStyles="btn-danger"
                              handleClick={() => {}}
                           />
                        </ConfirmationModal>
                        <CustomButton
                           title={'Editar'}
                           handleClick={() => handleSolveNavigation()}
                           containerStyles="btn-primary"
                        />
                     </div>
                  </div>
               ) : (
                  <CustomButton
                     title={'Ver detalles'}
                     handleClick={() => handleSolveNavigation()}
                     containerStyles="btn-primary card__body-details"
                  />
               )}
            </div>
         </div>
         <div className="card__image">
            <FrameViewerModal
               file={{
                  ...post,
                  name: post.coverImage,
                  type: 'Imagen',
               }}
               isImage>
               <ImageComponent
                  src={
                     post.coverImage.includes('/')
                        ? `${urlApi}/${post.coverImage}`
                        : '/assets/images/image-not-found.png'
                  }
                  alt={`${post.id}-cover-image`}
                  w={500}
                  h={480}
                  addLoader={true}
               />
            </FrameViewerModal>
         </div>
      </div>
   );
};
