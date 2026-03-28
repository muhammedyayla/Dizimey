import React from 'react'
import { Link } from 'react-router-dom'
import { API_IMG } from '../../constants/api'
import useTrailerHover from '../../hooks/useTrailerHover'
import CardTrailerOverlay from '../common/CardTrailerOverlay'
import { FaStar } from 'react-icons/fa6'
import './RecommendCard.css'

const RecommendCard = ({ item }) => {
  const { id, media_type, poster_path, backdrop_path, vote_average } = item
  const title = item.title || item.name || item.original_title || item.original_name
  const rating = vote_average ? vote_average.toFixed(1) : '—'
  const to = media_type === 'tv' ? `/tv/${id}` : `/movie/${id}`
  const mediaTypeLabel = media_type === 'tv' ? 'SERIES' : 'MOVIE'

  const { isHovered, showVideo, trailerUrl, handleMouseEnter, handleMouseLeave } = useTrailerHover(id, media_type)

  return (
    <Link 
      to={to} 
      className={`recommend-card ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className='recommend-card__media-wrapper'>
        <div
          className='recommend-card__media'
          style={{ backgroundImage: `url(${API_IMG}/${poster_path || backdrop_path})` }}
        >
          {/* Video Trailer Overlay */}
          <CardTrailerOverlay show={showVideo} trailerUrl={trailerUrl} title={title} />

          {/* Top Badges */}
          <div className='recommend-card__badge recommend-card__badge--type'>
            {mediaTypeLabel}
          </div>
          <div className='recommend-card__badge recommend-card__badge--rating'>
            <FaStar aria-hidden="true" />
            <span>{rating}</span>
          </div>

          <div className='recommend-card__overlay' />
        </div>
      </div>
      <p className='recommend-card__title'>{title}</p>
    </Link>
  )
}

export default RecommendCard
