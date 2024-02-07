'use client';
import React from 'react';
import { toast } from 'react-hot-toast';
import ClearIcon from '@mui/icons-material/Clear';

import CustomFileInput from '@/components/CustomInputs/CustomFileInput';
import { Info } from '@/components/alerts/Info';
import { ConfirmationModal } from '@/components/common/modals/ConfirmationModal';
import { ImageComponent } from '@/components/common/ImageComponent';

import { IPostCurrentResources, IPostResources } from '@/interfaces';
import { urlApi } from '@/libs/utils/url';
import { FrameViewerModal } from '../common/modals/FrameViewerModal';

interface Props {
   id: number;
   currentFiles: IPostCurrentResources;
   setCurrentFiles: React.Dispatch<React.SetStateAction<IPostCurrentResources>>;
   formData: IPostResources;
   setFormData: React.Dispatch<React.SetStateAction<IPostResources>>;
}

export const FormAddImage = (props: Props) => {
   const { id, currentFiles, setCurrentFiles, formData, setFormData } = props;
   const limit = 12;

   const validateImageDimensions = (file: File) => {
      return new Promise((resolve) => {
         const img = new Image();
         img.onload = function () {
            // Si la altura es mayor que el ancho, es una imagen vertical
            const imageElement = this as HTMLImageElement;
            resolve(imageElement.width >= imageElement.height);
         };
         img.src = URL.createObjectURL(file);
      });
   };

   const handleAddImage = async (
      e: React.ChangeEvent<HTMLInputElement>,
      isCoverImage = false
   ) => {
      if (!e.target.files) return;

      const acceptedTypes = [
         'image/jpeg',
         'image/png',
         'image/jpg',
         'image/gif',
         'image/webp',
         'image/svg+xml',
         'image/apng',
      ];
      const validateType = Array.from(e.target.files).some(
         (file) => file.type && !acceptedTypes.includes(file.type)
      );

      if (validateType) {
         toast.error('Solo puedes subir archivos de imagen');
      }

      const currentSlots = formData.images
         ? formData.images.length + currentFiles.images.length + e.target.files.length
         : 0;

      if (currentSlots >= limit) {
         toast.error(`Solo puedes subir un maximo de ${limit} archivos`);
      }

      const selectedFiles = Array.from(e.target.files)
         .filter((file) => file.type && acceptedTypes.includes(file.type))
         .slice(0, limit - e.target.files.length); // Limitar a 10 archivos

      const validFilesPromises = selectedFiles.map(async (file) => {
         if (file.size > 5000000) {
            toast.error('Las imágenes no pueden pesar más de 5MB');
            return null;
         }

         const isValid = await validateImageDimensions(file);
         if (!isValid) {
            toast.error('Las imágenes verticales no son permitidas');
            return null;
         }
         return file;
      });

      const validFiles = (await Promise.all(validFilesPromises)).filter(
         Boolean
      ) as File[];

      // Almacenar los objetos File directamente en el estado
      if (isCoverImage) {
         setFormData({ ...formData, coverImage: validFiles[0] });
      } else {
         setFormData({
            ...formData,
            images: [...formData.images, ...validFiles],
         });
      }
   };

   const handleDeleteImage = (name: string) => {
      setFormData({
         ...formData,
         images: formData.images.filter((file) => file.name !== name),
      });
   };

   const handleDeleteCoverImage = () => {
      setFormData({
         ...formData,
         coverImage: '',
      });
   };

   return (
      <div className="container-form-files">
         <Info message={`Puedes subir hasta ${limit} imágenes, no mayores a 5MB`} />
         <div className="flex flex-row justify-between w-full">
            <CustomFileInput
               name="cover-image"
               label="Cargar Portada"
               multiple={false}
               onChange={(e) => handleAddImage(e, true)}
               accept="image/*"
            />
            <CustomFileInput
               name="image"
               label="Cargar imagenes"
               onChange={handleAddImage}
               accept="image/*"
            />
         </div>
         <div className="form-files">
            <div className="file">
               <FrameViewerModal file={formData.coverImage} isImage>
                  <button className="file__delete" onClick={handleDeleteCoverImage}>
                     <ClearIcon />
                  </button>
                  <ImageComponent
                     src={
                        formData?.coverImage instanceof File
                           ? URL.createObjectURL(formData.coverImage)
                           : `${urlApi}/${currentFiles.coverImage}`
                     }
                     alt={`cover-image`}
                     w={500}
                     h={480}
                  />
               </FrameViewerModal>
            </div>
            {currentFiles.images?.map((file, index: number) => (
               <div key={index} className="file">
                  <FrameViewerModal file={file} key={index} isImage>
                     <ConfirmationModal
                        title="¿Seguro que deseas eliminar esta imagen?"
                        target={file.id}
                        fetcher="delete-asset"
                        extraReloadFunc={() =>
                           setCurrentFiles((prev) => ({
                              ...prev,
                              images: prev.images.filter((f) => f.id !== file.id),
                           }))
                        }>
                        <ClearIcon />
                     </ConfirmationModal>
                     <ImageComponent
                        src={`${urlApi}/${file.name}`}
                        alt={`image-${index}`}
                        w={500}
                        h={480}
                     />
                  </FrameViewerModal>
               </div>
            ))}
            {formData.images?.map((file, index: number) => (
               <div key={index} className="file">
                  <FrameViewerModal file={file} key={index} isImage>
                     <button
                        className="file__delete"
                        onClick={() => handleDeleteImage(file.name)}>
                        <ClearIcon />
                     </button>
                     <ImageComponent
                        src={URL.createObjectURL(file)}
                        alt=""
                        w={500}
                        h={480}
                     />
                  </FrameViewerModal>
               </div>
            ))}
         </div>
      </div>
   );
};
