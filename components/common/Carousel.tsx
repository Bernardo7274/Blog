'use client';

import React, { useEffect, useState } from 'react';

import CarouselCard from '@/components/common/CardCarousel';

import { IPost } from '@/interfaces';

interface Props {
   items: IPost[];
}

export default function Carousel(props: Props) {
   const { items } = props;
   const numItems = items.length;
   const [activeSlide, setActiveSlide] = useState(0);
   const [touchStart, setTouchStart] = useState<number | null>(null);
   const [touchEnd, setTouchEnd] = useState<number | null>(null);
   const minSwipeDistance = 50; // Define el mínimo desplazamiento para considerarlo un swipe

   const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
   };

   const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
      setTouchEnd(e.targetTouches[0].clientX);
   };

   const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      console.log('touchStart', touchStart);

      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
         handleNextSlide();
      } else if (isRightSwipe) {
         handlePrevSlide();
      }
   };

   useEffect(() => {
      const carouselItems = document.querySelectorAll('[data-carousel-item]');
      carouselItems.forEach((item, index) => {
         if (index === activeSlide) {
            item.classList.remove('hidden');
         } else {
            item.classList.add('hidden');
         }
      });
   }, [activeSlide]);

   const handlePrevSlide = () => {
      setActiveSlide((prevSlide) => (prevSlide === 0 ? numItems - 1 : prevSlide - 1));
   };

   const handleNextSlide = () => {
      setActiveSlide((prevSlide) => (prevSlide + 1) % numItems);
   };

   const handleSlideTo = (index: any) => {
      setActiveSlide(index);
   };

   return (
      <div
         id="default-carousel"
         className="relative w-100"
         data-carousel="slide"
         onTouchStart={handleTouchStart}
         onTouchMove={handleTouchMove}
         onTouchEnd={handleTouchEnd}>
         {/* Carousel wrapper */}
         <div className="flex justify-center w-full overflow-hidden rounded-lg md: p-6">
            {items?.map((item, index) => (
               <div
                  key={index}
                  className={`hidden duration-700 ease-in-out ${
                     activeSlide === index ? '' : 'opacity-0'
                  }`}
                  data-carousel-item>
                  <CarouselCard key={`${item.id}-${index}`} post={item} />
               </div>
            ))}
         </div>
         {/* Slider indicators */}
         <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
            {items.map((_, index) => (
               <button
                  key={index}
                  type="button"
                  className={`w-3 h-3 rounded-full ${
                     activeSlide === index ? 'bg-white' : 'bg-gray-400'
                  }`}
                  aria-current={activeSlide === index}
                  aria-label={`Slide ${index + 1}`}
                  data-carousel-slide-to={index}
                  onClick={() => handleSlideTo(index)}></button>
            ))}
         </div>
         {/* Slider controls */}
         <button
            type="button"
            className="carousel__btn--left absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev
            onClick={handlePrevSlide}>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-white group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
               <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="M15 19l-7-7 7-7"></path>
               </svg>
               <span className="sr-only">Previous</span>
            </span>
         </button>
         <button
            type="button"
            className="carousel__btn--right absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next
            onClick={handleNextSlide}>
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-white group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
               <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="M9 5l7 7-7 7"></path>
               </svg>
               <span className="sr-only">Next</span>
            </span>
         </button>
      </div>
   );
}
