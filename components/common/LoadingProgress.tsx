import React from 'react';
import { HammondLoader } from '@/components/common/HammondLoader';

export const LoadingProgress = () => {
   return (
      <div className="modal-container">
         <HammondLoader />
         <div className="relative">
            <div className="progress-loader">
               <div className="progress" />
            </div>
         </div>
      </div>
   );
};
