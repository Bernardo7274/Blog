'use client';
import { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { ImageComponent } from '@/components/common/ImageComponent';

import { IAssets, IPost } from '@/interfaces';
import { urlApi } from '@/libs/utils/url';
import { PageNotFound } from '@/components/common/PageNotFound';
import { extractYouTubeID, formatDate } from '@/libs/utils/common-functions';
import { FrameViewerModal } from '../common/modals/FrameViewerModal';

interface Props {
   post: IPost;
}

const ASSET_IMAGE = 'Imagen';
const ASSET_LINK = 'Enlace';
const ASSET_FILE = 'Pdf';

export default function PostDetail({ post }: Props) {
   const [imageSelected, setImageSelected] = useState(post.coverImage);
   const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
   const assets = post.assets
      ? {
           images: post.assets.filter((asset) => asset.type === ASSET_IMAGE),
           videos: post.assets.filter((asset) => asset.type === ASSET_LINK),
           pdf: post.assets.filter((asset) => asset.type === ASSET_FILE),
        }
      : { images: [], videos: [], pdf: [] };

   assets.images.unshift({ id: 0, name: post.coverImage, type: ASSET_IMAGE });

   useEffect(() => {
      const handleResize = () => {
         setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
         });
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);
   const isMobile = windowSize.width <= 768;

   if (!post || post.status === 'rechazado') {
      return <PageNotFound title="¡Oops! No encontramos la publicación" />;
   }

   return (
      <>
         <div className="post-detail-layout gap-4">
            <div>
               <div className="flex flex-col sm:flex-row w-full justify-between mb-2 xl:mb-4">
                  <p
                     className="
                  text-3xl font-semibold mt-2
                  xl:text-4xl">
                     {post.title}
                  </p>
                  {post.eventDate && (
                     <span className="text-md sm:text-lg">
                        {formatDate(post.eventDate)}
                     </span>
                  )}
               </div>

               <div className="md:row-span-2 lg:row-span-3 mt-10">
                  <p
                     className="
                              text-neutral-500 text-base whitespace-pre-line text-justify
                              lg:pr-12
                              xl:text-lg 
                              2xl:text-xl">
                     {post.description}
                  </p>
               </div>
            </div>
            <div>
               <div>
                  <FrameViewerModal
                     file={{ id: 0, name: imageSelected, type: 'Imagen' }}
                     isImage>
                     <ImageComponent
                        src={`${urlApi}/${imageSelected}`}
                        w={1600}
                        h={900}
                        containerStyles="cover__image rounded-xl"
                     />
                  </FrameViewerModal>
               </div>
               <div
                  className="
                  grid grid-cols-1 gap-4 mx-auto
                  md:grid-cols-2 
                  lg:grid-cols-4 mt-4">
                  {assets.images.map((image, i) => {
                     return (
                        <ImageComponent
                           key={i}
                           src={`${urlApi}/${image.name}`}
                           w={828}
                           h={466}
                           containerStyles="cover__image-min"
                           imageStyle={`
                              rounded-xl w-full h-full 
                              ${image.name === imageSelected ? 'md:contrast-50' : ''}`}
                           handleClick={
                              isMobile ? () => {} : () => setImageSelected(image.name)
                           }
                           addLoader={true}
                        />
                     );
                  })}
               </div>
            </div>
         </div>
         <div className="post-files">
            {assets.videos.length > 0 && (
               <div className="post-files__item">
                  <div className="post-files__item__title">
                     <h3 className="text-2xl font-semibold">Videos</h3>
                  </div>
                  <div className="form-files">
                     {assets.videos.map((video, i) => {
                        const videoID = extractYouTubeID(video.name);
                        return (
                           <div className="file justify-start" key={i}>
                              <FrameViewerModal
                                 file={{
                                    id: video.id,
                                    name: video.name,
                                    type: video.type,
                                 }}>
                                 <ImageComponent
                                    src={`https://img.youtube.com/vi/${videoID}/0.jpg`}
                                    w={420}
                                    h={310}
                                    containerStyles="rounded-xl"
                                 />
                              </FrameViewerModal>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
            {assets.pdf.length > 0 && (
               <div className="post-files__item">
                  <div className="post-files__item__title">
                     <h3 className="text-2xl font-semibold">Documentos</h3>
                  </div>
                  <div className="form-files flex-col">
                     {assets.pdf.map((pdf, i) => {
                        const path = `${urlApi}/${pdf.name}`;
                        return (
                           <div className="file--pdf justify-start" key={i}>
                              <FrameViewerModal file={pdf}>
                                 <VisibilityIcon />
                              </FrameViewerModal>
                              <div className="">{pdf.name.split('/').pop()}</div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </>
   );
}
