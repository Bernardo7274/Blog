import React from 'react';
import { useRouter } from 'next/navigation';

import { CustomButton } from '@/components/CustomInputs/CustomButton';
import { ImageComponent } from '@/components/common/ImageComponent';
import { FrameViewerModal } from '@/components/common/modals/FrameViewerModal';

import { IPost } from '@/interfaces';
import { url, urlApi } from '@/libs/utils/url';

interface Props {
   post: IPost;
}

export default function CarouselCard({ post }: Props) {
   const router = useRouter();
   return (
      <div className="cardcarousel">
         <div className="cardcarousel__body">
            <div>
               <div className="cardcarousel__title">{post.title}</div>
               <div className="cardcarousel__summary">
                  <p>{post.summary}</p>
               </div>
            </div>
            <div className="cardcarousel__button">
               <CustomButton
                  title={'Ver detalles'}
                  handleClick={() => {
                     router.push(url.postDetail(post.id));
                  }}
                  containerStyles="btn-primary"
               />
            </div>
         </div>
         <div className="cardcarousel__image">
            <FrameViewerModal
               file={{ id: post.id, name: post.coverImage, type: 'Image' }}
               isImage>
               <ImageComponent
                  src={
                     `${urlApi}/${post.coverImage}` ||
                     '/assets/images/image-not-found.png'
                  }
                  alt="logo"
                  w={1024}
                  h={720}
                  addLoader={true}
               />
            </FrameViewerModal>
         </div>
      </div>
   );
}
