import React, { useEffect } from 'react'
import './ContinueWatching.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWatchProgress } from '../../redux/slices/watchProgressSlice'
import { Link } from 'react-router-dom'
import { API_IMG } from '../../constants/api'
import { MdPlayArrow } from 'react-icons/md'
import SwiperSection from '../swiperSection/SwiperSection'
import Loading from '../Loading/Loading'

const ContinueWatching = () => {
  const dispatch = useDispatch()
  const { items, loading } = useSelector((store) => store.watchProgress)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      dispatch(fetchWatchProgress())
    }
  }, [dispatch, token])

  if (!token || items.length === 0) {
    return null
  }

  if (loading) {
    return (
      <SwiperSection title="Kaldığın Yerden Devam Et" slidesPerView="auto" spaceBetween={16}>
        <div className='state'>
          <Loading />
        </div>
      </SwiperSection>
    )
  }

  return (
    <SwiperSection title="Kaldığın Yerden Devam Et" slidesPerView="auto" spaceBetween={16}>
      {items.slice(0, 20).map((item) => {
        const detailPath = item.media_type === 'tv' ? `/tv/${item.tmdb_id}` : `/${item.tmdb_id}`
        const progressPercent = Math.min(100, Math.max(0, item.progress_percent || 0))

        return (
          <Link key={`${item.tmdb_id}-${item.media_type}-${item.season_number || 0}-${item.episode_number || 0}`} 
                to={detailPath} 
                className='continue-watching-card'>
            <div className='continue-watching-card__media'>
              <div
                className='continue-watching-card__thumbnail'
                style={{
                  backgroundImage: `url(${API_IMG}/${item.backdrop_path || item.poster_path})`,
                }}
              />
              <div className='continue-watching-card__overlay'>
                <div className='continue-watching-card__progress-bar'>
                  <div 
                    className='continue-watching-card__progress-fill'
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <button className='continue-watching-card__play-btn' aria-label='Devam et'>
                  <MdPlayArrow />
                </button>
              </div>
              {item.season_number && item.episode_number && (
                <div className='continue-watching-card__badge'>
                  S{item.season_number} E{item.episode_number}
                </div>
              )}
            </div>
            <div className='continue-watching-card__info'>
              <h4 className='continue-watching-card__title'>{item.title}</h4>
              <p className='continue-watching-card__progress-text'>
                {Math.round(progressPercent)}% izlendi
              </p>
            </div>
          </Link>
        )
      })}
    </SwiperSection>
  )
}

export default ContinueWatching

