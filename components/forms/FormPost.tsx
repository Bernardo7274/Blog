'use client';
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { ChangeEvent, useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import PushPinIcon from '@mui/icons-material/PushPin';

import { CustomSelect } from '@/components/CustomInputs/CustomSelect';
import { CustomInputText } from '@/components/CustomInputs/CustomInputText';
import { CustomTextarea } from '@/components/CustomInputs/CustomTextarea';
import { CustomButton } from '@/components/CustomInputs/CustomButton';
import { FormAddImage } from '@/components/forms/FormAddImage';
import { FormAddPDF } from '@/components/forms/FormAddPDF';
import { FormAddLink } from '@/components/forms/FormAddLink';

import { Error } from '@/components/alerts/Error';
import { CustomTag } from '@/components/common/CustomTag';
import CustomInputDate from '@/components/CustomInputs/CustomInputDate';
import { FormApproved } from '@/components/forms/FormApproved';
import { usePostData } from '@/hooks/useGetPostById';

import { apiRequest } from '@/libs/axios-api';
import { url } from '@/libs/utils/url';
import { getTitleVideos } from '@/libs/utils/common-functions';
import {
   serializedAssetsByPost,
   serializedCurrentFiles,
   serializedCurrentResources,
   serializedFormDataPost,
   serializedNewPost,
   serializedPostUpdate,
} from '@/libs/utils/serializers';
import {
   ICatalogGen,
   IPost,
   IPostCurrentResources,
   IPostRequest,
   IPostResources,
   IPostStatus,
   IUser,
} from '@/interfaces';

interface Props {
   id: number;
   categories: ICatalogGen[];
   typesPost: ICatalogGen[];
   user: IUser | false;
}

export default function FormPost(props: Props) {
   const { id, categories, typesPost, user } = props;
   const router = useRouter();
   const [post, setPost] = useState<IPost>({} as any);
   usePostData(id, setPost);

   const [showForm, setShowForm] = useState('Image');
   const [isLoading, setIsLoading] = useState(false);
   const [currentFiles, setCurrentFiles] = useState<IPostCurrentResources>({} as any);
   const [resources, setResources] = useState<IPostResources>({} as any);
   const [formData, setFormData] = useState<IPostRequest>({} as any);

   const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const fieldName = e.target.name;
      const fieldValue = e.target.value;
      setFormData((prevState: IPostRequest) => ({
         ...prevState,
         [fieldName]: fieldValue,
      }));
   };

   const handleChangueSelectInput = (attribute: string, value: ICatalogGen) =>
      setFormData((prevState: IPostRequest) => ({
         ...prevState,
         [attribute]: value,
      }));

   const handleAddTag = () => {
      if (formData.currentTag === '' || !formData.currentTag) return;
      setFormData((prevState: IPostRequest) => ({
         ...prevState,
         tagsList: [...(prevState.tagsList || []), prevState.currentTag || '']?.filter(
            (tag) => tag !== ''
         ),
         currentTag: '',
      }));
   };

   const handleSubmit = async () => {
      setIsLoading(true);
      const token = getCookie('nova-access-token')?.toString() || '';
      if (formData.id) {
         const data = serializedPostUpdate(formData);
         const updatePost = await apiRequest.setPost(token, data, formData.id);

         if (updatePost?.status === 'Success') {
            const formDataNewAssets = new FormData();
            const serializedAssets = serializedAssetsByPost(resources);
            Object.keys(serializedAssets).forEach((key) => {
               const value = serializedAssets[key as keyof typeof serializedAssets];

               if (value) {
                  if (
                     Array.isArray(value) &&
                     value.length > 0 &&
                     value[0] instanceof File
                  ) {
                     // Si es un array de archivos, los agregamos uno por uno
                     value.forEach((file) => formDataNewAssets.append(key, file as any));
                  } else if (value instanceof File) {
                     // Si es un archivo individual
                     formDataNewAssets.append(key, value);
                  } else {
                     // Otros valores se convierten a cadena
                     formDataNewAssets.append(key, value.toString());
                  }
               }
            });

            const assets = await apiRequest.setAssetsPost(
               token,
               formDataNewAssets,
               formData.id
            );

            if (assets?.status === 'Success') {
               const status = await apiRequest.setStatusPost(
                  token,
                  formData.id,
                  null,
                  'pendiente'
               );
               if (status?.status === 'Success') {
                  router.push(url.adminPosts());
                  toast.success('Publicación actualizada');
               } else {
                  toast.error('Error al actualizar el estado de la publicación');
               }
            } else toast.error('Error al actualizar recursos');
         } else {
            toast.error('Error al actualizar publicación');
         }
      } else {
         const preData = { ...formData, ...resources };
         const data = serializedNewPost(preData);
         const formDataNewPost = new FormData();

         Object.keys(data).forEach((key) => {
            const value = data[key as keyof typeof data];

            if (value) {
               if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
                  // Si es un array de archivos, los agregamos uno por uno
                  value.forEach((file) => formDataNewPost.append(key, file));
               } else if (value instanceof File) {
                  // Si es un archivo individual
                  formDataNewPost.append(key, value);
               } else {
                  // Otros valores se convierten a cadena
                  formDataNewPost.append(key, String(value));
               }
            }
         });

         const savePost = await apiRequest.newPost(token, formDataNewPost);
         if (savePost?.status === 'Success') {
            toast.success('Publicación guardada');
            router.push('/admin/posts');
         } else {
            toast.error('Error al guardar publicación');
         }
      }
      setIsLoading(false);
   };

   const handlePinned = async () => {
      setIsLoading(true);
      const token = getCookie('nova-access-token')?.toString() || '';
      const pinnedPost = await apiRequest.pinnedPost(token, post.id);
      if (pinnedPost?.status === 'Success') {
         toast.success('Publicación fijada');
         router.refresh();
      } else {
         toast.error('Error al fijar publicación');
      }
      setIsLoading(false);
   };

   const handleSelector = (slug: 'Image' | 'PDF' | 'Link') => setShowForm(slug);
   const handleBack = () => router.push(url.adminPosts());

   useEffect(() => {
      (async () => {
         if (post?.id) {
            setFormData(serializedFormDataPost(post));
            setResources(serializedCurrentResources(post));
            setCurrentFiles(serializedCurrentFiles(post));
            if (post && post.id !== 0 && post.assets?.length) {
               const videos =
                  post.assets?.filter((asset) => asset.type === 'Enlace') || [];
               const videosWithTitle = (await Promise.all(getTitleVideos(videos))) as any;
               setCurrentFiles((prevState) => ({
                  ...prevState,
                  videos: videosWithTitle,
               }));
            }
         } else {
            setFormData(serializedFormDataPost({} as any));
            setResources(serializedCurrentResources({} as any));
            setCurrentFiles(serializedCurrentFiles({} as any));
         }
      })();
   }, [post]);

   return (
      <div className="form__post">
         <div className="container__text">
            <div className="container__subtitle cursor-pointer" onClick={handleBack}>
               <PlayArrowIcon sx={{ transform: 'rotate(180deg)', color: '#607EE9' }} />
               <h3>Regresar</h3>
            </div>
            <div className="container__inputs">
               <div className="container__inputs-buttons">
                  <CustomInputDate
                     name="eventDate"
                     onChange={handleInput}
                     value={formData.eventDate}
                     label="Fecha del evento"
                  />
                  <div className="flex gap-6 mt-[0.75rem]">
                     {typeof post?.id === 'number' && post?.id !== 0 && (
                        <FormApproved
                           status={formData?.status}
                           target={post?.id}
                           user={user}
                           currentComments={post?.comments}
                           changeStatus={(status: IPostStatus) =>
                              setFormData(
                                 (prev: IPostRequest) =>
                                    ({ ...prev, status: status } as any)
                              )
                           }
                        />
                     )}
                     {post?.status === 'aprobado' &&
                        post.category?.id === 8 &&
                        post.type.includes('Convocatoria') &&
                        (!post?.isPinned ? (
                           <CustomButton
                              title={'Fijar'}
                              containerStyles="btn-primary"
                              handleClick={handlePinned}
                              isLoading={isLoading}
                           />
                        ) : (
                           <div className="flex justify-center items-center">
                              <PushPinIcon className="mr-5" />
                              <span>Fijada</span>
                           </div>
                        ))}
                  </div>
               </div>
               <CustomTextarea
                  name={'title'}
                  value={formData.title}
                  minRows={1}
                  onChangueValue={handleInput}
                  placeholder={'Encabezado'}
                  boldText={true}
               />
               <Error
                  message={
                     formData?.title?.length > 80
                        ? `Excedio el limite de caracteres ${formData.title.length} de 80`
                        : ''
                  }
               />
               <CustomTextarea
                  name={'summary'}
                  value={formData.summary}
                  minRows={2}
                  onChangueValue={handleInput}
                  placeholder={'Descripción corta'}
               />
               <Error
                  message={
                     formData?.summary?.length > 110
                        ? `Excedio el limite de caracteres ${formData.summary.length} de 110`
                        : ''
                  }
               />
               <CustomTextarea
                  name={'description'}
                  value={formData.description}
                  minRows={20}
                  onChangueValue={handleInput}
                  placeholder={'Artículo'}
               />
            </div>
         </div>
         <div className="container__multimedia">
            <div className="container__subtitle">
               <h3>Multimedia</h3>
            </div>

            <div>
               <p>Presiona el formato que deseas subir</p>
               <div className="container__btns__multimedia">
                  <CustomButton
                     title={'Imagen'}
                     handleClick={() => handleSelector('Image')}
                     containerStyles={
                        'w-1/5 py-2 h-auto btn-left--tab ' +
                        (showForm === 'Image' ? 'btn-primary--tab' : 'btn-secondary--tab')
                     }
                  />

                  <CustomButton
                     title={'PDF'}
                     handleClick={() => handleSelector('PDF')}
                     containerStyles={
                        'w-1/5 py-2 h-auto ' +
                        (showForm === 'PDF' ? 'btn-primary--tab' : 'btn-secondary--tab')
                     }
                  />

                  <CustomButton
                     title={'Link'}
                     handleClick={() => handleSelector('Link')}
                     containerStyles={
                        'w-1/5 py-2 h-auto btn-right--tab ' +
                        (showForm === 'Link' ? 'btn-primary--tab' : 'btn-secondary--tab')
                     }
                  />
               </div>
               {showForm === 'Image' ? (
                  <FormAddImage
                     id={formData.id}
                     currentFiles={currentFiles}
                     setCurrentFiles={setCurrentFiles}
                     formData={resources}
                     setFormData={setResources}
                  />
               ) : null}

               {showForm === 'PDF' ? (
                  <FormAddPDF
                     id={formData.id}
                     currentFiles={currentFiles}
                     setCurrentFiles={setCurrentFiles}
                     formData={resources}
                     setFormData={setResources}
                  />
               ) : null}

               {showForm === 'Link' ? (
                  <FormAddLink
                     id={formData.id}
                     currentFiles={currentFiles}
                     setCurrentFiles={setCurrentFiles}
                     formData={resources}
                     setFormData={setResources}
                  />
               ) : null}
            </div>
            <div className="container-identifiers">
               <div className="container__subtitle">
                  <h3>Identificadores</h3>
               </div>

               <div className="container-indentifiers__body">
                  <CustomSelect
                     attributeToChangue="category"
                     defaultOption={formData.category}
                     options={categories}
                     onChangueValue={handleChangueSelectInput}
                  />
                  <CustomSelect
                     attributeToChangue="typeSelect"
                     defaultOption={formData.typeSelect!}
                     options={typesPost}
                     onChangueValue={handleChangueSelectInput}
                  />
               </div>

               <div className="w-full p-5" />

               <CustomInputText
                  placeholder="Tags"
                  attributeToChangue="currentTag"
                  value={formData.currentTag || ''}
                  onChangueValue={handleInput}>
                  <button
                     className="custom-text__btn"
                     onClick={handleAddTag}
                     disabled={formData.currentTag === ''}>
                     <AddIcon />
                  </button>
               </CustomInputText>

               <div className="container__tags">
                  {formData.tagsList?.map((tag, index) => (
                     <CustomTag
                        key={index}
                        tag={tag}
                        onDelete={() => {
                           setFormData((prev: IPostRequest) => ({
                              ...prev,
                              tagsList: prev.tagsList?.filter(
                                 (tagFilter: string) => tagFilter !== tag
                              ),
                           }));
                        }}
                     />
                  ))}
               </div>
            </div>
            <div>
               <CustomButton
                  title={formData.id === 0 ? 'Crear publicación' : 'Guardar'}
                  handleClick={handleSubmit}
                  containerStyles="btn-primary px-5"
                  isLoading={isLoading}
               />
            </div>
         </div>
      </div>
   );
}
