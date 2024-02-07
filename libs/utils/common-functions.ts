import { IAssets } from '@/interfaces';
import { apiRequest } from '../axios-api';

// search functional received array u object and string to search and return array with items that match the search
export const handlesearchItems = (items: any[], searchText: string) => {
   const words = searchText.toLowerCase().split(' ');

   if (!items) return items;

   return items?.filter((item) => {
      const sanitizedItem = JSON.stringify(item)
         .normalize('NFD')
         .replace(/[\u0300-\u036f]/g, '')
         .toLowerCase();

      const punctuationRemovedItem = sanitizedItem.replace(
         /[.,\/#!$%\^&\*;:{}=\-_`~()"]/g,
         ' '
      );

      return words.some((word) => {
         const sanitizedWord = word
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

         const punctuationRemovedWord = sanitizedWord.replace(
            /[.,\/#!$%\^&\*;:{}=\-_`~()"]/g,
            ''
         );

         return punctuationRemovedItem.includes(punctuationRemovedWord);
      });
   });
};

export const getTitleVideos = (videos: IAssets[]) =>
   videos.map(async (video, index) => {
      const videoId = extractYouTubeID(video.name);

      if (videoId) {
         const snipeds = await apiRequest.getYoutubeSnippet(videoId);
         const title = snipeds?.items[0]?.snippet?.title;
         return {
            ...video,
            title,
         };
      }
      return {
         ...video,
         title: `Video ${index + 1}`,
      };
   });

export const extractYouTubeID = (url: string) => {
   const regexes = [
      /https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/, // Formato estándar
      /https?:\/\/www\.youtube\.com\/live\/([a-zA-Z0-9_-]{11})\?feature=share/, // Formato de en vivo
      /https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/, // Formato corto
      /https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/, // Formato embed
      /src="https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]{11})"/,
   ];

   for (let regex of regexes) {
      const match = url.match(regex);
      if (match) return match[1];
   }

   return null;
};

export const getEmbedLinkFromYouTubeID = (videoId: string) => {
   return `https://www.youtube.com/embed/${videoId}`;
};

export const formatDate = (
   isoDate: Date | string,
   format: 'dmy' | 'ymd' = 'dmy',
   separator: '/' | '-' = '/'
) => {
   if (!isoDate) return '';
   const date = new Date(isoDate);
   const day = String(date.getDate()).padStart(2, '0');
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const year = date.getFullYear();
   const dateFormats = {
      dmy: `${day}${separator}${month}${separator}${year}`,
      ymd: `${year}${separator}${month}${separator}${day}`,
   };
   return dateFormats[format];
};
