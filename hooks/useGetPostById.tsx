'use client';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';

import { IPost, IAssets } from '@/interfaces';
import { apiRequest } from '@/libs/axios-api';
import { getCookie } from 'cookies-next';

const useNovaAccessToken = () => getCookie('nova-access-token')?.toString() || '';

export const usePostData = (
   id: number,
   setCurrentPost: React.Dispatch<React.SetStateAction<IPost>>
) => {
   const getPostById = async () => {
      const token = useNovaAccessToken();

      const post = await apiRequest.getPostByIdCrud(token, id);
      setCurrentPost(post);
   };

   useEffect(() => {
      getPostById();
   }, [id]);

   return <></>;
};
