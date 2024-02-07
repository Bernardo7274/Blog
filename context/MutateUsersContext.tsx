import React from 'react';

import { IUser } from '@/interfaces';

interface IMutateUsersContext {
   users: IUser[];
   setUsers: (users: IUser[]) => void;
}
const initialContext: IMutateUsersContext = {
   users: [],
   setUsers: (() => {}) as any,
};

export default React.createContext(initialContext);
