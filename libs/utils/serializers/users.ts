import { IUserForm } from '@/interfaces';

export const serializedNewUser = (user: IUserForm) => ({
   email: user.email,
   departmentId: user.department.id,
   roleId: user.role.id,
});

export const serializedPutUser = (user: IUserForm) => ({
   roleId: user.role.id,
   departmentId: user.department.id,
   email: user.email,
});
