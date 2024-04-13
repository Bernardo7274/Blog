'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { HammondLoader } from '@/components/common/HammondLoader';

interface Props {
   src: string;
   handleClick?: () => void;
   containerStyles?: string;
   imageStyle?: string;
   alt?: string;
   defaultImg?: string;
   w: number;
   h: number;
   addLoader?: boolean;
}

export const ImageComponent = ({
   src,
   handleClick,
   containerStyles = '',
   imageStyle = '',
   alt = 'Imagen Original',
   defaultImg = '/assets/images/image-not-found.png',
   w,
   h,
   addLoader = false,
}: Props) => {
   const [image, setImage] = useState(src);
   const [loading, setLoading] = useState(true);

   const handleImageError = () => {
      setImage(defaultImg);
      setLoading(false);
   };

   const handleImageLoad = () => {
      setTimeout(() => {
         setLoading(() => false);
      }, 500);
   };

   useEffect(() => {
      setImage(src);

      handleImageLoad();
   }, [src]);

   return (
      <div
         className={`w-full h-full ${containerStyles}`}
         onClick={image !== defaultImg && handleClick ? handleClick : () => {}}>
         {loading && addLoader && (
            <div className="flex w-full justify-center items-center">
               <HammondLoader />
            </div>
         )}{' '}
         <Image
            src={image}
            alt={alt}
            width={w}
            height={h}
            onError={handleImageError}
            onLoad={handleImageLoad}
            className={loading ? 'hidden' : imageStyle}
         />
      </div>
   );
};
