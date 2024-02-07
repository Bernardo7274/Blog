'use client';
import React, { useContext, useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

import { LoadingProgress } from '@/components/common/LoadingProgress';
import { Posts } from '@/components/common/Posts';

import { apiRequest } from '@/libs/axios-api';
import MutatePostsContext from '@/context/MutatePostsContext';

export default function AdminPosts() {
   const { posts, setPosts } = useContext(MutatePostsContext);
   const [isLoading, setIsLoading] = useState<boolean>(true);

   useEffect(() => {
      (async () => {
         const token = getCookie('nova-access-token');
         const posts = await apiRequest.getPostsCrud(String(token));

         setPosts(posts);
         setIsLoading(() => false);
      })();
   }, [setPosts]);

   return <>{isLoading ? <LoadingProgress /> : <Posts posts={posts} />}</>;
}
