import img0 from '../images/services/0.png'
import img1 from '../images/services/1.png'
import img2 from '../images/services/2.png'
import img4 from '../images/services/4.png'
import img3 from '../images/services/3.png'
import img5 from '../images/services/5.png'
import img6 from '../images/services/6.png'
import Image from 'next/image'
import { useState } from 'react'

const Carousel = () => {
  const images = [img0, img1, img2, img3, img4, img5, img6]
  const [currentImg, setCurrentImg] = useState(0)
  const next = () => {
    if (currentImg < images.length - 1) {
      setCurrentImg(currentImg + 1)
    } else {
      setCurrentImg(0)
    }
  }
  const previous = () => {
    if (currentImg >= 1) {
      setCurrentImg(currentImg - 1)
    } else {
      setCurrentImg(images.length - 1)
    }
  }
  return (
    <>
      <div className="m-auto max-w-2xl ">
        <div
          id="default-carousel"
          className="relative mb-4 mt-4 ml-4"
          data-carousel="static"
        >
          <div className="relative flex h-56 items-center  justify-center overflow-hidden rounded-lg sm:h-64 xl:h-80 2xl:h-96">
            <div className=" duration-700 ease-in-out" data-carousel-item>
              <Image
                src={images[currentImg]}
                className="h-40 w-40 rounded-xl"
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
