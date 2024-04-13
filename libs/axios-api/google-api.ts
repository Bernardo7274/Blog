import { api } from '.';

export const apiGoogle = {
   getYoutubeSnippet: async (id: string) =>
      await api('next', 'GET', `/youtube/${id}`)
         .then((data) => data)
         .catch((e) => false),
};
