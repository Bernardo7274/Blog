import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

interface Props {
   message: string;
}

export const Info = (props: Props) => {
   const { message } = props;
   return (
      <>
         {message && (
            <div className="flex items-center justify-start w-full gap-10">
               <InfoIcon className="mr-5" />
               <span className="text-sm text-blue-700">{message}</span>
            </div>
         )}
      </>
   );
};
