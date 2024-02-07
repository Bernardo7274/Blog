import { api } from '@/libs/axios-api/axios';
import { ICatalogGen } from '@/interfaces';

export const apiCatalogs = {
   getCategories: async (): Promise<ICatalogGen[]> =>
      await api('next', 'GET', '/catalogs/categories')
         .then((data) => data)
         .catch((e) => {
            console.log(e);
            return [];
         }),

   getTypesPost: async (): Promise<ICatalogGen[]> => [
      { id: 1, name: 'Evento' },
      { id: 2, name: 'Convocatoria interna' },
      { id: 3, name: 'Convocatoria externa' },
      { id: 4, name: 'Proyecto' },
      { id: 5, name: 'Investigación' },
   ],

   getDepartments: async (): Promise<ICatalogGen[]> =>
      await api('next', 'GET', '/catalogs/departments')
         .then((data) => data)
         .catch((e) => []),

   getRoles: async (): Promise<ICatalogGen[]> =>
      await api('next', 'GET', '/catalogs/roles')
         .then((data) => data)
         .catch((e) => []),
};
