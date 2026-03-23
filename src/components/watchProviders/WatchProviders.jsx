import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { Link } from 'react-router-dom'
import {
  API_WATCH_PROVIDERS_URL,
  API_DISCOVER_MOVIE_URL,
  API_DISCOVER_TV_URL,
  API_KEY,
  API_IMG,
} from '../../constants/api'
import axios from 'axios'
import 'swiper/css'
import 'swiper/css/navigation'
import './WatchProviders.css'

// Netflix'in TMDB provider_id'si 8'dir. Varsayılan olarak Netflix seçilir.
const NETFLIX_ID = 8

const WatchProviders = () => {
  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [content, setContent] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [loadingContent, setLoadingContent] = useState(false)
  const [swiper, setSwiper] = useState(null)
  const [prevEl, setPrevEl] = useState(null)
  const [nextEl, setNextEl] = useState(null)

  // Provider listesini çek (TR bölgesi)
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get(
          `${API_WATCH_PROVIDERS_URL}?api_key=${API_KEY}&watch_region=TR&language=tr-TR`
        )
        const sorted = (res.data.results || [])
          .filter((p) => p.logo_path && p.provider_name)
          .sort((a, b) => (a.display_priority ?? 999) - (b.display_priority ?? 999))
          .slice(0, 15) // Sadece ilk 15 provider'ı al

        setProviders(sorted)

        // Netflix'i varsayılan yap; yoksa ilk provider'ı seç
        const netflix = sorted.find((p) => p.provider_id === NETFLIX_ID) || sorted[0]
        if (netflix) setSelectedProvider(netflix)
      } catch (error) {
        console.error('Yayın platformları yüklenirken hata:', error)
      } finally {
        setLoadingProviders(false)
      }
    }
    fetchProviders()
  }, [])

  // Seçilen provider'ın film ve dizilerini çek
  const fetchContent = useCallback(async (providerId) => {
    if (!providerId) return
    setLoadingContent(true)
    try {
      const [moviesRes, tvRes] = await Promise.all([
        axios.get(
          `${API_DISCOVER_MOVIE_URL}?api_key=${API_KEY}&watch_region=TR&with_watch_providers=${providerId}&sort_by=release_date.desc&language=tr-TR&page=1`
        ),
        axios.get(
          `${API_DISCOVER_TV_URL}?api_key=${API_KEY}&watch_region=TR&with_watch_providers=${providerId}&sort_by=first_air_date.desc&language=tr-TR&page=1`
        ),
      ])

      const movies = (moviesRes.data.results || [])
        .filter((m) => m.poster_path)
        .slice(0, 10)
        .map((m) => ({ ...m, media_type: 'movie' }))

      const tv = (tvRes.data.results || [])
        .filter((t) => t.poster_path)
        .slice(0, 10)
        .map((t) => ({ ...t, media_type: 'tv' }))

      const combined = [...movies, ...tv].sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date || 0)
        const dateB = new Date(b.release_date || b.first_air_date || 0)
        return dateB - dateA
      })

      setContent(combined)
    } catch (error) {
      console.error('İçerik yüklenirken hata:', error)
      setContent([])
    } finally {
      setLoadingContent(false)
    }
  }, [])

  useEffect(() => {
    if (selectedProvider) {
      fetchContent(selectedProvider.provider_id)
    }
  }, [selectedProvider, fetchContent])

  // Provider değişince swiper'ı başa al
  useEffect(() => {
    if (swiper) {
      swiper.slideTo(0)
    }
  }, [content, swiper])

  if (loadingProviders) return null
  if (providers.length === 0) return null

  return (
    <section className='swiper-section watch-providers'>
      {/* Provider Seçim Bar'ı */}
      <div className='watch-providers__bar'>
        <div className='watch-providers__pills'>
          {providers.map((provider) => (
            <button
              key={provider.provider_id}
              className={`watch-providers__pill${selectedProvider?.provider_id === provider.provider_id ? ' is-active' : ''}`}
              onClick={() => setSelectedProvider(provider)}
            >
              {provider.provider_name}
            </button>
          ))}
        </div>
      </div>

      {/* Başlık */}
      <div className='swiper-section__header watch-providers__header'>
        <h3>
          {selectedProvider ? `${selectedProvider.provider_name} — Yeni Çıkanlar` : 'Yayın Platformları'}
        </h3>
      </div>

      {/* İçerik Swiper */}
      {loadingContent ? (
        <div className='watch-providers__loading'>
          <span>Yükleniyor...</span>
        </div>
      ) : (
        <div className='swiper-section__container'>
          <button
            ref={(node) => setPrevEl(node)}
            className='swiper-section__nav-btn swiper-section__nav-btn--prev'
            aria-label='Önceki'
          >
            <MdChevronLeft />
          </button>
          <Swiper
            modules={[Navigation]}
            navigation={{ prevEl, nextEl }}
            spaceBetween={14}
            slidesPerView='auto'
            onSwiper={setSwiper}
            className='swiper-section__swiper'
          >
            {content.map((item) => {
              const title = item.title || item.name || item.original_title || item.original_name
              const year =
                item.release_date || item.first_air_date
                  ? new Date(item.release_date || item.first_air_date).getFullYear()
                  : null
              const to = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`

              return (
                <SwiperSlide key={`${item.media_type}-${item.id}`} className='swiper-section__slide'>
                  <Link to={to} className='provider-content-card'>
                    <div
                      className='provider-content-card__poster'
                      style={{ backgroundImage: `url(${API_IMG}/${item.poster_path})` }}
                    >
                      <span className='provider-content-card__badge'>
                        {item.media_type === 'tv' ? 'Dizi' : 'Film'}
                      </span>
                    </div>
                    <p className='provider-content-card__title'>{title}</p>
                    {year && <span className='provider-content-card__year'>{year}</span>}
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
          <button
            ref={(node) => setNextEl(node)}
            className='swiper-section__nav-btn swiper-section__nav-btn--next'
            aria-label='Sonraki'
          >
            <MdChevronRight />
          </button>
        </div>
      )}
    </section>
  )
}

export default WatchProviders
