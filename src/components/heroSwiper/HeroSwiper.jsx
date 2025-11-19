import React, { useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, EffectFade } from 'swiper/modules'
import { MdChevronLeft, MdChevronRight, MdInfoOutline, MdPlayArrow } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { API_IMG, API_MOVIE_IMAGES_URL, API_TV_IMAGES_URL, API_KEY } from '../../constants/api'
import axios from 'axios'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import './HeroSwiper.css'

const getEnglishTitle = (item) =>
  item?.title || item?.name || item?.original_title || item?.original_name || ''

const HeroSwiper = ({ movies, genres }) => {
  const [swiper, setSwiper] = useState(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const [logos, setLogos] = useState({})

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

  useEffect(() => {
    const fetchLogos = async () => {
      const logoPromises = movies.map(async (movie) => {
        if (!movie.id) return null
        try {
          const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie')
          const imagesUrl = mediaType === 'tv' ? `${API_TV_IMAGES_URL}/${movie.id}/images` : `${API_MOVIE_IMAGES_URL}/${movie.id}/images`
          const res = await axios.get(`${imagesUrl}?api_key=${API_KEY}`)
          const logo = res.data.logos?.find((logo) => logo.iso_639_1 === 'en') || res.data.logos?.[0]
          return { id: movie.id, logoPath: logo?.file_path }
        } catch (error) {
          console.error(`Logo yüklenirken hata (${movie.id}):`, error)
          return { id: movie.id, logoPath: null }
        }
      })
      const results = await Promise.all(logoPromises)
      const logosMap = results.reduce((acc, result) => {
        if (result) acc[result.id] = result.logoPath
        return acc
      }, {})
      setLogos(logosMap)
    }
    if (movies.length > 0) {
      fetchLogos()
    }
  }, [movies])

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
                {logos[movie.id] ? (
                  <img src={`${API_IMG}/${logos[movie.id]}`} alt={getEnglishTitle(movie)} className='hero-swiper__logo' />
                ) : (
                  <h1>{getEnglishTitle(movie) || 'Dizimey Originals'}</h1>
                )}
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
                    <Link to={movie.media_type === 'tv' ? `/tv/${movie.id}` : `/${movie.id}`} className='button button--primary'>
                      <MdPlayArrow aria-hidden='true' />
                      Oynat
                    </Link>
                  )}
                  {movie && (
                    <Link to={movie.media_type === 'tv' ? `/tv/${movie.id}` : `/${movie.id}`} className='button button--secondary'>
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

