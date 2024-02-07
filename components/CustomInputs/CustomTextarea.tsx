'use client';
import React, { ChangeEvent } from 'react';
import TextareaAutosize from '@mui/base/TextareaAutosize';

interface Props {
   name: string;
   value: string;
   minRows: number;
   placeholder: string;
   boldText?: boolean;
   onChangueValue: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CustomTextarea = ({
   name,
   value,
   minRows,
   placeholder,
   boldText,
   onChangueValue,
}: Props) => {
   return (
      <div className="flex w-full h-auto justify-between">
         <TextareaAutosize
            className="w-full h-full bg-background p-4 rounded-lg border border-borderLines no-underline focus-visible:outline-0"
            aria-label="Demo input"
            placeholder={placeholder}
            style={{ fontWeight: boldText ? 'bold' : 'normal' }}
            minRows={minRows}
            name={name}
            value={value}
            onChange={onChangueValue}
         />
      </div>
   );
};
