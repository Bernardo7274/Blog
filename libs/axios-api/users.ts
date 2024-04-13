import { api } from '@/libs/axios-api';
import jwt from 'jsonwebtoken';
import { INovaJWTDecode, IUser, IUserForm } from '@/interfaces';

export const apiUsers = {
   getUSers: async (token: string): Promise<IUser[]> =>
      await api('next', 'GET', '/users', { Authorization: `Bearer ${token}` })
         .then((data) => data)
         .catch((e) => []),

   newUser: async (token: string, user: IUserForm) =>
      await api('next', 'POST', '/users', { Authorization: `Bearer ${token}` }, user)
         .then((data) => data)
         .catch((e) => false),

   putUser: async (token: string, user: IUserForm) =>
      await api('next', 'PUT', '/users', { Authorization: `Bearer ${token}` }, user)
         .then((data) => data)
         .catch((e) => false),

   deleteUser: async (token: string, id: number) =>
      await api('next', 'DELETE', `/users?id=${id}`, {
         Authorization: `Bearer ${token}`,
      })
         .then(() => true)
         .catch(() => false),

   getCurrentUser: (token: string) => {
      try {
         const decode = jwt.decode(token) as any as INovaJWTDecode;
         return decode;
      } catch (error) {
         return false;
      }
   },
};
