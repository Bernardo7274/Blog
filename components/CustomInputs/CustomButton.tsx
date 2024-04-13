'use client';

import React from 'react';

import { LoadingSpin } from '@/components/common/LoadingSpin';

interface Props {
   title: string;
   handleClick: () => void;
   containerStyles?: string;
   isLoading?: boolean;
   btnType?: 'button' | 'submit';
   disabled?: boolean;
   children?: React.ReactNode;
}

export const CustomButton = ({
   title,
   handleClick,
   containerStyles = '',
   isLoading = false,
   btnType = 'button',
   disabled = false,
   children,
}: Props) => {
   return (
      <button
         disabled={disabled || isLoading}
         type={btnType}
         className={`btn ${containerStyles} ${isLoading ? 'p-5' : ''}`}
         onClick={handleClick}>
         {isLoading ? <LoadingSpin /> : children || title}
         <span className="ml-2">{title === 'Regresar' && title}</span>
      </button>
   );
};
