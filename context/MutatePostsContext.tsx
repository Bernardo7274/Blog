import React from 'react';

import { IPost } from '@/interfaces';

interface IMutatePostsContext {
   posts: IPost[];
   setPosts: (posts: IPost[]) => void;
}
const initialContext: IMutatePostsContext = {
   posts: [],
   setPosts: (() => {}) as any,
};

export default React.createContext(initialContext);
