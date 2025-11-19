import React, { useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import 'swiper/css'
import 'swiper/css/navigation'
import './SwiperSection.css'

const SwiperSection = ({ title, children, slidesPerView = 'auto', spaceBetween = 16 }) => {
  const [swiper, setSwiper] = useState(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  useEffect(() => {
    if (swiper && prevRef.current && nextRef.current) {
      swiper.params.navigation.prevEl = prevRef.current
      swiper.params.navigation.nextEl = nextRef.current
      swiper.navigation.init()
      swiper.navigation.update()
    }
  }, [swiper])

  return (
    <section className='swiper-section'>
      <div className='swiper-section__header'>
        <h3>{title}</h3>
        <div className='swiper-section__navigation'>
          <button ref={prevRef} className='swiper-section__nav-btn swiper-section__nav-btn--prev' aria-label='Önceki'>
            <MdChevronLeft />
          </button>
          <button ref={nextRef} className='swiper-section__nav-btn swiper-section__nav-btn--next' aria-label='Sonraki'>
            <MdChevronRight />
          </button>
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        onSwiper={setSwiper}
        className='swiper-section__swiper'
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index} className='swiper-section__slide'>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default SwiperSection

