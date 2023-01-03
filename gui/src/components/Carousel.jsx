import img0 from '../images/stock/0.png'
import img1 from '../images/stock/1.png'
import img2 from '../images/stock/2.png'
import img4 from '../images/stock/4.png'
import img3 from '../images/stock/3.png'
import img5 from '../images/stock/5.png'
import img6 from '../images/stock/6.png'
import img7 from '../images/stock/7.png'
import img8 from '../images/stock/8.png'
import img9 from '../images/stock/9.png'
import img10 from '../images/stock/10.png'
import img11 from '../images/stock/11.png'
import img12 from '../images/stock/12.png'
import img13 from '../images/stock/13.png'
import img14 from '../images/stock/14.png'
import img15 from '../images/stock/15.png'
import Image from 'next/image'
import { useState } from 'react'

const Carousel = () => {
  const images = [img0, img1, img2, img3, img4, img5, img6, img7, img8,img9, img10, img11, img12, img13, img14, img15]
  const [currentImg, setCurrentImg] = useState(1)
  const next = () => {
    if (currentImg < images.length - 2) {
      setCurrentImg(currentImg + 1)
    } else {
      setCurrentImg(1)
    }
  }
  const previous = () => {
    if (currentImg >= 2) {
      setCurrentImg(currentImg - 1)
    } else {
      setCurrentImg(images.length - 2)
    }
  }
  return (
    <>



     
      

           <div className="m-auto max-w-2xl">
          
        <div
          id="default-carousel"
          className="relative"
          data-carousel="static"
        >
           
          <div className="relative flex h-56 items-center transition-all justify-center overflow-hidden rounded-lg sm:h-64 xl:h-80 2xl:h-96">
        
            <div
              className="rounded-xl border-gray border-solid border-1 shadow-[-10px_-10px_20px_5px_#d53f8c,10px_10px_20px_5px_#4299e1] flex justify-center overflow-hidden transition-all duration-700 ease-in-out"
              data-carousel-item
            >
              
              
              <Image
                src={images[currentImg - 1]}
                className="h-40 w-40"
                alt=""
              />
              <Image
                src={images[currentImg]}
                className="h-40 w-40 "
                alt=""
              />
              <Image
                src={images[currentImg + 1]}
                className="h-40 w-40 "
                alt=""
              />
            </div>
          </div>
          <button
            type="button"
            className="group absolute top-0 left-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
            onClick={previous}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10">
              <svg
                className="h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </span>
          </button>
          <button
            type="button"
            className="group absolute top-0 right-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
            onClick={next}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10">
              <svg
                className="h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
          


 
 


    </>
  )
}

export default Carousel
