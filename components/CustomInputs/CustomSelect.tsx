/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { ICatalogGen } from '@/interfaces';

interface Props {
   options: ICatalogGen[];
   defaultOption: ICatalogGen;
   attributeToChangue: string;
   isChangueQuery?: boolean;
   onChangueValue?: (attributeToChangue: string, value: ICatalogGen) => void;
   disabled?: boolean;
   containerStyles?: string;
}

export const CustomSelect = ({
   options,
   defaultOption,
   attributeToChangue,
   isChangueQuery = false,
   onChangueValue,
   disabled,
   containerStyles,
}: Props) => {
   const currentRefAttribute = useRef<HTMLInputElement>(null);
   const router = useRouter();
   const path = usePathname();
   const searchParams = useSearchParams();

   const handleChangueValue = (id: number) => {
      if (!isChangueQuery && onChangueValue) {
         const selected = options.find((option) => option.id === id);
         if (!selected) return;
         onChangueValue(attributeToChangue, selected);
      } else {
         router.replace(`${path}?${attributeToChangue}=${id}`);
      }
   };

   const handleChangueByQuery = async () => {
      const currentAttribute = searchParams.get(attributeToChangue);
      console.log(currentAttribute);
      if (!currentAttribute) return;
      const selected = options.find((option) => option.id === Number(currentAttribute));
      console.log(selected);
      if (!selected) return;
      if (onChangueValue) onChangueValue(attributeToChangue, selected);
   };

   useEffect(() => {
      if (onChangueValue) onChangueValue(attributeToChangue, defaultOption || options[0]);
   }, [options]);

   // establece el valor por defecto si no existe el parametro en la url
   useEffect(() => {
      const currentAttribute = searchParams.get(attributeToChangue);
      console.log(currentAttribute);
      if (!currentAttribute && defaultOption) {
         if (currentRefAttribute?.current?.value) {
            console.log(currentRefAttribute?.current?.value);
            currentRefAttribute.current.value = String(defaultOption.id);
         }
      }
      handleChangueByQuery();
   }, [searchParams, defaultOption]);

   return (
      <div className={containerStyles}>
         <select
            name={attributeToChangue}
            ref={currentRefAttribute as any}
            disabled={disabled}
            onChange={(e) => handleChangueValue(Number(e.target.value))}>
            {defaultOption && (
               <option value={defaultOption.id}>{defaultOption.name}</option>
            )}
            {options?.length > 0 &&
               options?.map((option, i) =>
                  option?.id === defaultOption?.id ||
                  option?.name === defaultOption?.name ? null : (
                     <option key={`${option.name}-${i}`} value={option.id}>
                        {option.name}
                     </option>
                  )
               )}
         </select>
      </div>
   );
};
