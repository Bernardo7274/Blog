import React from 'react';
import { ImageComponent } from './ImageComponent';

interface Props {
   title: string;
   alt?: string;
}
export const CardEmptyPost = ({ title, alt }: Props) => {
   return (
      <div className="card-empty-post">
         <div className="card-empty-post__body">
            <div className="card__title">{title}</div>
            <ImageComponent
               src="/assets/images/cat-crying.jpg"
               containerStyles="max-w-max"
               alt={alt}
               w={200}
               h={100}
            />
         </div>
      </div>
   );
};
