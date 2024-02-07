import { apiAuth } from './auth';
import { apiPosts } from './posts';
import { apiUsers } from './users';
import { apiCatalogs } from './catalogs';
import { apiGoogle } from './google-api';
import { api } from './axios';

const apiRequest = {
   ...apiAuth,
   ...apiPosts,
   ...apiUsers,
   ...apiCatalogs,
   ...apiGoogle,
};

export { apiRequest, api };
