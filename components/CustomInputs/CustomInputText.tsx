'use client';
import React, { ChangeEvent } from 'react';

interface Props {
   label?: string;
   children?: React.ReactNode;
   placeholder: string;
   attributeToChangue: string;
   value: string;
   onChangueValue: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const CustomInputText = ({
   label,
   children,
   placeholder,
   attributeToChangue,
   value,
   onChangueValue,
}: Props) => {
   return (
      <div className="flex w-full justify-between">
         {label && <span>{label}:</span>}
         <input
            name={attributeToChangue}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChangueValue(e)}
         />
         {children && children}
      </div>
   );
};
