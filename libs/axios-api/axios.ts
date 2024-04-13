import axios, { AxiosRequestConfig } from 'axios';

export const axiosAPIClient = axios.create({
   baseURL: `${process.env.NEXT_PUBLIC_URL_BASE}/api`,
   headers: { 'Content-Type': 'application/json' },
});

export const axiosAPIServer = axios.create({
   baseURL: process.env.NEXT_PUBLIC_URL_API,
   headers: { 'Content-Type': 'application/json' },
});

// Función para manejar las peticiones
export const api = async <T = any>(
   type: 'next' | 'api',
   method: AxiosRequestConfig['method'],
   url: string,
   headers?: any,
   data?: any,
   config?: AxiosRequestConfig
): Promise<T> => {
   try {
      if (type === 'api') {
         const response = await axiosAPIServer({
            method,
            url,
            data,
            headers: {
               ...(config?.headers || {}),
               ...headers,
            },
            ...config,
         });
         return response.data as T;
      } else {
         const response = await axiosAPIClient({
            method,
            url,
            data,
            headers: {
               ...(config?.headers || {}),
               ...headers,
            },
            ...config,
         });
         return response.data as T;
      }
   } catch (error: any) {
      if (error.response) {
         // El servidor respondió con un código de estado fuera del rango de 2xx
         console.log('Error Status:', error.response?.status);
         console.log('Error Data:', error.response?.data);
         console.log('Error Headers:', error.response?.headers);
      } else if (error.request) {
         // La petición fue realizada pero no se recibió ninguna respuesta
         console.log('Error Request:', error?.request);
      } else {
         // Algo sucedió en la configuración de la petición que desencadenó un error
         console.log('Error Message:', error?.message);
      }

      console.log(error.config);
      throw error;
   }
};
