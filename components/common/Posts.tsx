/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { IPost } from '@/interfaces';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/common/Card';
import { handlesearchItems } from '@/libs/utils/common-functions';
import { ImageComponent } from './ImageComponent';

interface Props {
   posts: IPost[];
}

export const Posts = ({ posts }: Props) => {
   const [filteredPosts, setFilteredPosts] = useState<IPost[]>(posts);
   const searchParams = useSearchParams();
   const category = searchParams.get('category');
   const search = searchParams.get('search');
   const status = searchParams.get('status');

   const filterPosts = (posts: IPost[]) => {
      if (category && category !== '0') {
         return posts.filter((post) => post.category.id === Number(category));
      }
      if (search && typeof search === 'string') {
         return handlesearchItems(posts, search);
      }
      if (status /*&& status !== '0'*/) {
         const statusN = Number(status);
         return posts.filter((post) => {
            if (statusN === 0) return true;
            else if (statusN === 1) return post.status === 'aprobado';
            else if (statusN === 2) return post.status === 'pendiente';
            else if (statusN === 3) return post.status === 'rechazado';
         });
      }
      return posts;
   };

   useEffect(() => {
      setFilteredPosts(filterPosts(posts));
   }, [searchParams, posts]);

   return (
      <>
         {filteredPosts?.length > 0 ? (
            <div className="post-container">
               {filteredPosts.map((post, index) => (
                  <Card key={`${post.id}-${index}`} post={post} />
               ))}
            </div>
         ) : (
            <div className="flex flex-col w-full justify-center items-center">
               <div className="w-[60vw] flex flex-col items-center">
                  <h1 className="text-3xl text-center">
                     Sin resultados para tu búsqueda{' '}
                  </h1>
                  <strong className="text-3xl">{search}</strong>
               </div>
               <ImageComponent
                  src="/assets/images/no-data.png"
                  w={500}
                  h={250}
                  containerStyles="flex justify-center h-96"
               />
            </div>
         )}
      </>
   );
};
