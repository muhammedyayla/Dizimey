import React, { useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import 'swiper/css'
import 'swiper/css/navigation'
import './SwiperSection.css'

const SwiperSection = ({ title, titleBig, titleSmall, children, headerRight, slidesPerView = 'auto', spaceBetween = 16 }) => {
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
      <div className={`swiper-section__header ${titleBig && titleSmall ? 'swiper-section__header--top10' : ''}`}>
        <div className='swiper-section__header-content'>
          {titleBig && titleSmall ? (
            <div className='swiper-section__titles-group'>
              <h1 className='swiper-section__title-big'>{titleBig}</h1>
              <h3 className='swiper-section__title-small'>{titleSmall}</h3>
            </div>
          ) : (
            <h3>{title}</h3>
          )}
          {headerRight && <div className='swiper-section__header-right'>{headerRight}</div>}
        </div>
      </div>
      <div className='swiper-section__container'>
        <button ref={prevRef} className='swiper-section__nav-btn swiper-section__nav-btn--prev' aria-label='Önceki'>
          <MdChevronLeft />
        </button>
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
        <button ref={nextRef} className='swiper-section__nav-btn swiper-section__nav-btn--next' aria-label='Sonraki'>
          <MdChevronRight />
        </button>
      </div>
    </section>
  )
}

export default SwiperSection

