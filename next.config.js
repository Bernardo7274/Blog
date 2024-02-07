/** @type {import('next').NextConfig} */
//Debemos agregar esta configuración para que las imagenes se puedan mostrar en el servidor de producción
const nextConfig = {
   images: {
      domains: [
         '*',
         'localhost', // dominio base de el front end en desarrollo
         'servicios.upqroo.edu.mx', // dominio base de el back end
         'nova-up-test.vercel.app', // dominio base de el front end
         'www.youtube.com', // dominio para mostrar recursos de youtube
         'img.youtube.com', // dominio para mostrar recursos de youtube (imagenes)
      ],
   },
};

module.exports = nextConfig;
