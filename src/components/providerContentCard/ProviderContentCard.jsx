import React from 'react'
import { Link } from 'react-router-dom'
import { API_IMG } from '../../constants/api'
import useTrailerHover from '../../hooks/useTrailerHover'
import CardTrailerOverlay from '../common/CardTrailerOverlay'
import { FaStar } from 'react-icons/fa6'
import './ProviderContentCard.css'

const ProviderContentCard = ({ item }) => {
  const { id, media_type, poster_path, vote_average } = item
  const title = item.title || item.name || item.original_title || item.original_name
  const year = item.release_date || item.first_air_date ? new Date(item.release_date || item.first_air_date).getFullYear() : null
  const rating = vote_average ? vote_average.toFixed(1) : '—'
  const to = media_type === 'tv' ? `/tv/${id}` : `/movie/${id}`
  const mediaTypeLabel = media_type === 'tv' ? 'SERIES' : 'MOVIE'

  const { isHovered, showVideo, trailerUrl, handleMouseEnter, handleMouseLeave } = useTrailerHover(id, media_type)

  return (
    <Link 
      to={to} 
      className={`provider-content-card ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className='provider-content-card__poster-wrapper'>
        <div
          className='provider-content-card__poster'
          style={{ backgroundImage: `url(${API_IMG}/${poster_path})` }}
        >
          {/* Video Trailer Overlay */}
          <CardTrailerOverlay show={showVideo} trailerUrl={trailerUrl} title={title} />

          {/* Top Badges */}
          <div className='provider-content-card__badge provider-content-card__badge--type'>
            {mediaTypeLabel}
          </div>
          <div className='provider-content-card__badge provider-content-card__badge--rating'>
            <FaStar aria-hidden="true" />
            <span>{rating}</span>
          </div>

          <div className='provider-content-card__overlay' />
        </div>
      </div>
      <div className='provider-content-card__info'>
        <p className='provider-content-card__title'>{title}</p>
        {year && <span className='provider-content-card__year'>{year}</span>}
      </div>
    </Link>
  )
}

export default ProviderContentCard
