'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ImageComponent } from '@/components/common/ImageComponent';
import { CustomButton } from '@/components/CustomInputs/CustomButton';
import { url } from '@/libs/utils/url';

interface Props {
   title?: string;
}

export const PageNotFound = ({ title }: Props) => {
   const router = useRouter();
   return (
      <div className="w-full flex justify-center flex-col">
         <ImageComponent
            src="/svg/404-cat.svg"
            w={550}
            h={250}
            containerStyles="flex justify-center max-h-[300px] md:max-h-max"
         />
         {title && (
            <h1 className="text-center text-2xl text-[var(--normal-text)] mb-4">
               {title}
            </h1>
         )}
         <div className="flex flex-row justify-center">
            <CustomButton
               title="Volver al inicio"
               containerStyles="mr-4 btn-primary text-sm px-2"
               handleClick={() => router.push(url.home())}
            />
            <CustomButton
               title="Ver categorias"
               containerStyles="btn-primary text-sm px-2"
               handleClick={() => router.push(url.posts())}
            />
         </div>
      </div>
   );
};
