export const url = {
   home: () => '/',
   posts: () => '/posts',
   postDetail: (id: number) => `/posts/${id}`,
   adminPosts: () => '/admin/posts',
   adminPostsEditable: (id: number) => `/admin/posts/${id}`,
   adminUsers: () => '/admin/users',
};

export const urlApi =
   `${process.env.NEXT_PUBLIC_URL_BASE}/api` || 'http://localhost:3000';
