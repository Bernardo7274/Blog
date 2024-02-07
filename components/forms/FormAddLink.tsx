'use client';
import React, { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { CustomInputText } from '@/components/CustomInputs/CustomInputText';
import { ConfirmationModal } from '@/components/common/modals/ConfirmationModal';
import { FrameViewerModal } from '@/components/common/modals/FrameViewerModal';

import { IPostCurrentResources, IPostResources } from '@/interfaces';
import {
   extractYouTubeID,
   getEmbedLinkFromYouTubeID,
} from '@/libs/utils/common-functions';
import { apiRequest } from '@/libs/axios-api';
import { CustomButton } from '../CustomInputs/CustomButton';

interface Props {
   id: number;
   currentFiles: IPostCurrentResources;
   setCurrentFiles: React.Dispatch<React.SetStateAction<IPostCurrentResources>>;
   formData: IPostResources;
   setFormData: React.Dispatch<React.SetStateAction<IPostResources>>;
}

export const FormAddLink = (props: Props) => {
   const { id, currentFiles, setCurrentFiles, formData, setFormData } = props;
   const [currentLink, setCurrentLink] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
      setCurrentLink(() => e.target.value);
   };

   const handleAddLink = async () => {
      setIsLoading(true);
      let title = `video_${formData.videos.length + 1}}`;
      const videoId = extractYouTubeID(currentLink);

      if (videoId) {
         const path = getEmbedLinkFromYouTubeID(videoId);
         const snipeds = await apiRequest.getYoutubeSnippet(videoId);
         if (snipeds?.items?.length > 0) {
            title = snipeds?.items[0]?.snippet?.title;
         }

         setFormData({
            ...formData,
            videos: [...formData.videos, { title, url: path }],
         });
         setCurrentLink('');
      } else {
         toast.error('El link no es valido');
      }
      setIsLoading(false);
   };

   return (
      <div className="container-form-files">
         <CustomInputText
            placeholder="Youtube link"
            attributeToChangue="currentTag"
            value={currentLink || ''}
            onChangueValue={handleInput}>
            <CustomButton
               title="+"
               containerStyles="custom-text__btn"
               handleClick={handleAddLink}
               disabled={currentLink === ''}
               isLoading={isLoading}>
               <AddIcon />
            </CustomButton>
         </CustomInputText>

         <div className="container__tags">
            {currentFiles.videos?.map((link, index) => (
               <div key={index} className="custom-tag">
                  <FrameViewerModal
                     file={{ id, name: link.name || link.title, type: 'Enlace' }}>
                     <VisibilityIcon />
                  </FrameViewerModal>

                  <span>{link.title}</span>
                  <ConfirmationModal
                     title="¿Seguro que deseas eliminar este video?"
                     target={link.id}
                     fetcher="delete-asset"
                     extraReloadFunc={() =>
                        setCurrentFiles((prev) => ({
                           ...prev,
                           videos: prev.videos.filter((f) => f.id !== link.id),
                        }))
                     }>
                     <ClearIcon />
                  </ConfirmationModal>
               </div>
            ))}
            {formData.videos?.map((link, index) => (
               <div key={index} className="custom-tag">
                  <FrameViewerModal
                     file={{
                        id,
                        name: link.url || link.title,
                        type: 'Enlace',
                     }}>
                     <VisibilityIcon />
                  </FrameViewerModal>
                  <span>{link.title}</span>
                  <button
                     className="custom-tag__btn"
                     onClick={() => {
                        setFormData((prev: IPostResources) => ({
                           ...prev,
                           videos: prev.videos?.filter(
                              (linkFilter) => linkFilter !== link
                           ),
                        }));
                     }}>
                     <ClearIcon />
                  </button>
               </div>
            ))}
         </div>
      </div>
   );
};
