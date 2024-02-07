import React from 'react';

interface Props {
   message: string;
}

export const Error = (props: Props) => {
   const { message } = props;
   return (
      <>
         {message && (
            <div className="text-red-500">
               <span>{message}</span>
            </div>
         )}
      </>
   );
};
