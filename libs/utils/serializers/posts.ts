import {
   IPost,
   IPostCurrentResources,
   IPostForm,
   IPostRequest,
   IPostResources,
} from '@/interfaces';
import { formatDate } from '../common-functions';

export const serializedNewPost = (data: IPostForm) => {
   const baseObject = {
      categoryId: data.category.id,
      title: data.title,
      description: data.description,
      summary: data.summary,
      type: data?.typeSelect?.name || 'Convocatoria interna',
      tags: data?.tagsList?.join(',') || '',
      comments: data.comments || '',
      files: [...data.images, ...data.pdfs],
      coverImageFile: data.coverImage,
      links: data?.videos?.map((video) => video.url).join(',') || '',
   };

   return data.eventDate
      ? {
           ...baseObject,
           eventDate: data.eventDate,
        }
      : baseObject;
};

export const serializedPostUpdate = (data: IPostRequest) => {
   const baseObject = {
      categoryId: data.category.id,
      title: data.title,
      description: data.description,
      summary: data.summary,
      type: data.type,
      tags: data?.tagsList?.join(',') || data.tags,
      comments: data.comments || '',
   };
   return data.eventDate
      ? {
           ...baseObject,
           eventDate: data.eventDate,
        }
      : baseObject;
};

export const serializedAssetsByPost = (data: IPostResources) => ({
   links: data.videos.map((video) => video.url).join(','),
   files: [...data.images, ...data.pdfs],
   coverImageFile: data.coverImage,
});

export const serializedCurrentFiles = (data: IPost) => ({
   coverImage: data.coverImage ? data.coverImage : '/assets/images/image-not-found.png',
   images: data.assets?.filter((asset) => asset.type === 'Imagen') || [],
   pdfs: data.assets?.filter((asset) => asset.type === 'Pdf') || [],
   videos: [],
});

export const serializedCurrentResources = (data: IPost) => ({
   coverImage: data.coverImage ? data.coverImage : '/assets/images/image-not-found.png',
   images: [],
   videos: [],
   pdfs: [],
});

export const serializedFormDataPost = (data: IPost) =>
   ({
      id: data.id || 0,
      category: data.category || { id: 0, name: 'Categorías' },
      assets: data.assets || [],
      title: data.title || '',
      description: data.description || '',
      summary: data.summary || '',
      publishDate: formatDate(data.publishDate, 'ymd', '-'),
      eventDate: formatDate(data.eventDate, 'ymd', '-'),
      typeSelect: data.type
         ? { id: 0, name: data.type }
         : { id: 0, name: 'Tipo de publicación' },
      type: data.type || '',
      tags: data.tags || '',
      tagsList: data.tags ? data.tags.split(',') : [],
      currentTag: '',
      comments: data.comments || '',
      status: data.status || 'rechazado',
   } as IPostForm);
