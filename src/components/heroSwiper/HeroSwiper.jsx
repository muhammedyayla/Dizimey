import React, { useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, EffectFade } from 'swiper/modules'
import { MdChevronLeft, MdChevronRight, MdInfoOutline, MdPlayArrow } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { API_IMG } from '../../constants/api'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import './HeroSwiper.css'

const getEnglishTitle = (item) =>
  item?.original_title || item?.original_name || item?.title || item?.name || ''

const HeroSwiper = ({ movies, genres }) => {
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

  const genreMap = React.useMemo(() => {
    return genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name
      return acc
    }, {})
  }, [genres])

  const renderBackdrop = (movie) => {
    if (!movie) return ''
    const path = movie.backdrop_path || movie.poster_path
    return path ? `${API_IMG}/${path}` : ''
  }

  return (
    <section className='hero-swiper'>
      <button ref={prevRef} className='hero-swiper__nav hero-swiper__nav--prev' aria-label='Önceki'>
        <MdChevronLeft />
      </button>
      <button ref={nextRef} className='hero-swiper__nav hero-swiper__nav--next' aria-label='Sonraki'>
        <MdChevronRight />
      </button>
      <Swiper
        modules={[Autoplay, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect='fade'
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={movies.length > 1}
        onSwiper={setSwiper}
        className='hero-swiper__swiper'
      >
        {movies.map((movie) => {
          const heroGenres = movie?.genre_ids
            ?.map((id) => genreMap[id])
            .filter(Boolean)
            .slice(0, 3)
            .join(' • ')

          const heroMetaItems = []
          if (heroGenres) heroMetaItems.push(heroGenres)
          if (movie?.release_date) {
            heroMetaItems.push(new Date(movie.release_date).getFullYear())
          } else if (movie?.first_air_date) {
            heroMetaItems.push(new Date(movie.first_air_date).getFullYear())
          }
          if (movie?.vote_average) heroMetaItems.push(`${movie.vote_average.toFixed(1)} IMDb`)

          return (
            <SwiperSlide key={movie.id} className='hero-swiper__slide'>
              <div
                className='hero-swiper__background'
                style={{ backgroundImage: renderBackdrop(movie) ? `url(${renderBackdrop(movie)})` : undefined }}
              />
              <div className='hero-swiper__overlay' />
              <div className='hero-swiper__content'>
                <h1>{getEnglishTitle(movie) || 'Dizimey Originals'}</h1>
                <p className='hero-swiper__description'>
                  {movie?.overview ||
                    'En popüler film ve dizileri izlemek için hazır olun. Keşfetmeye başlamak için aşağı kaydırın.'}
                </p>
                {heroMetaItems.length > 0 && (
                  <div className='hero-swiper__meta'>
                    {heroMetaItems.map((item, index) => (
                      <React.Fragment key={item}>
                        <span>{item}</span>
                        {index < heroMetaItems.length - 1 && <span className='dot' />}
                      </React.Fragment>
                    ))}
                  </div>
                )}
                <div className='hero-swiper__actions'>
                  {movie && (
                    <Link to={`/${movie.id}`} className='button button--primary'>
                      <MdPlayArrow aria-hidden='true' />
                      Oynat
                    </Link>
                  )}
                  {movie && (
                    <Link to={`/${movie.id}`} className='button button--secondary'>
                      <MdInfoOutline aria-hidden='true' />
                      Daha Fazla Bilgi
                    </Link>
                  )}
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}

export default HeroSwiper

