import Link from 'next/link';

import { Card } from '@/components/common/Card';
import Carousel from '@/components/common/Carousel';
import { ImageComponent } from '@/components/common/ImageComponent';

import { apiRequest } from '@/libs/axios-api';
import { CardEmptyPost } from '@/components/common/CardEmptyPost';

export default async function Home() {
   const latests = await apiRequest.getPostsLatest(5);
   const pinned = await apiRequest.getPostsPinned();

   const internalPosts = Array.isArray(pinned)
      ? pinned.find((post) => post.type === 'Convocatoria interna')
      : null;

   const externalPosts = Array.isArray(pinned)
      ? pinned.find((post) => post.type === 'Convocatoria externa')
      : null;

   return (
      <div>
         <div className="bg-[var(--background-dark)]">
            <Carousel items={(latests as any) || []} />
         </div>
         <div className="post-container">
            {internalPosts ? (
               <Card key={`${internalPosts.id}-Internal`} post={internalPosts} />
            ) : (
               <CardEmptyPost title="¡Oh no! Aún no hay convocatorias internas." />
            )}
            {externalPosts ? (
               <Card key={`${externalPosts.id}-External`} post={externalPosts} />
            ) : (
               <CardEmptyPost title="¡Uy! Aún no hay convocatorias externas." />
            )}
         </div>
         <div className="flex p-2 md:p-6">
            <div className="w-1/2">
               <ImageComponent
                  src="/assets/images/search-categories.png"
                  w={500}
                  h={300}
                  containerStyles="flex justify-center items-center"
               />
            </div>
            <div className="flex flex-col justify-center items-start w-1/2 p-4">
               <h1 className="text-base md:text-3xl pb-4 md:pb-6 text-[var(--subtitle-text)]">
                  ¿Estás buscando algo en específico?
               </h1>
               <p className="text-xs pb-16 sm:text-xl text-[var(--normal-text)]">
                  Ven a ver todas las noticias que tenemos para ti.
               </p>
               <Link
                  href="/posts"
                  className="btn btn-primary flex justify-center text-sm md:text-xl">
                  <span>Ver categorias</span>
               </Link>
            </div>
         </div>
      </div>
   );
}
