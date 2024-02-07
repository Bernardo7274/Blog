import React from 'react';

import { Posts } from '@/components/common/Posts';
import { CustomSelect } from '@/components/CustomInputs/CustomSelect';
import { InputSearch } from '@/components/CustomInputs/InputSearch';

import { apiRequest } from '@/libs/axios-api';

export default async function PostsPage() {
   const categories = await apiRequest.getCategories();
   const posts = await apiRequest.getPosts('');
   const extraOption = {
      id: 0,
      name: 'Recientes',
   };
   return (
      <>
         <div className="post-layout">
            <CustomSelect
               attributeToChangue="category"
               options={categories}
               defaultOption={extraOption}
               isChangueQuery={true}
               containerStyles="categories-container"
            />
            <InputSearch />
         </div>
         <Posts posts={posts} />
      </>
   );
}
