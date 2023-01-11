import img0 from '../images/stock/01.jpeg'
import img1 from '../images/stock/2.jpeg'
import img2 from '../images/stock/3.jpeg'
import img4 from '../images/stock/4.jpeg'
import img3 from '../images/stock/16.jpeg'
import img5 from '../images/stock/5.jpeg'
import img6 from '../images/stock/6.jpeg'
import img7 from '../images/stock/7.jpeg'
import img8 from '../images/stock/8.jpeg'
import img9 from '../images/stock/9.jpeg'
import img10 from '../images/stock/10.jpeg'
import img11 from '../images/stock/11.jpeg'
import img12 from '../images/stock/12.jpeg'
import img13 from '../images/stock/13.jpeg'
import img14 from '../images/stock/14.jpeg'
import img15 from '../images/stock/15.jpeg'
import img17 from '../images/stock/17.jpeg'
import img18 from '../images/stock/18.jpeg'
import img19 from '../images/stock/19.jpeg'
import img20 from '../images/stock/20.jpeg'
import img21 from '../images/stock/21.jpeg'
import img22 from '../images/stock/22.jpeg'
import img23 from '../images/stock/23.jpeg'
import img24 from '../images/stock/24.jpeg'
import img25 from '../images/stock/25.jpeg'
import img26 from '../images/stock/26.jpeg'
import img27 from '../images/stock/27.jpeg'
import img28 from '../images/stock/28.jpeg'
import img29 from '../images/stock/29.jpeg'
import img30 from '../images/stock/30.jpeg'
import img31 from '../images/stock/31.jpeg'
import img32 from '../images/stock/32.jpeg'
import img33 from '../images/stock/33.jpeg'
import img34 from '../images/stock/34.jpeg'
import Image from 'next/image'
import { useState } from 'react'

export const Carousel = () => {
  const images = [
    img0,
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
    img15,
    img17,
    img18,
    img19,
    img20,
    img21,
    img22,
    img23,
    img24,
    img25,
    img26,
    img27,
    img28,
    img29,
    img30,
    img31,
    img32,
    img33,
    img34,
  ]

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

  const updateCarousel = () => {
    return true
  }

  useState(() => {
    updateCarousel()
  }, [currentImg])

  return (
    <>
      <div className="m-auto max-w-2xl">
        <div id="default-carousel" className="relative" data-carousel="static">
          <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-lg transition-all sm:h-64 xl:h-80 2xl:h-96">
            {updateCarousel() && (
              <div
                className="border-gray border-1 flex justify-center overflow-hidden rounded-xl border-solid shadow-[0px_0px_10px_5px_#805ad5] transition-all duration-700 ease-in-out"
                data-carousel-item
              >
                <Image
                  src={images[currentImg - 1]}
                  className="h-40 w-40 object-cover"
                  alt=""
                />
                <Image
                  src={images[currentImg]}
                  className="h-40 w-40 object-cover "
                  alt=""
                />
                <Image
                  src={images[currentImg + 1]}
                  className="h-40 w-40 object-cover"
                  alt=""
                />
              </div>
            )}
          </div>
          <button
            type="button"
            className="group absolute top-0 left-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
            onClick={previous}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white sm:h-10 sm:w-10">
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
            <span className=" inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white sm:h-10 sm:w-10">
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
