import { PageNotFound } from '@/components/common/PageNotFound';
import React from 'react';

export default async function notFound() {
   return (
      <div className="container-not-found">
         <PageNotFound />
      </div>
   );
}
