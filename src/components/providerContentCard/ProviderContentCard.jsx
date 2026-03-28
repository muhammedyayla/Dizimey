import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_IMG } from '../../constants/api'
import useTrailerHover from '../../hooks/useTrailerHover'
import CardTrailerOverlay from '../common/CardTrailerOverlay'
import { FaStar } from 'react-icons/fa6'
import './ProviderContentCard.css'

const ProviderContentCard = ({ item }) => {
  const { id, media_type, poster_path, backdrop_path, vote_average } = item
  const title = item.title || item.name || item.original_title || item.original_name
  const rating = vote_average ? vote_average.toFixed(1) : '—'
  const to = media_type === 'tv' ? `/tv/${id}` : `/movie/${id}`
  const mediaTypeLabel = media_type === 'tv' ? 'SERIES' : 'MOVIE'

  const { isHovered, showVideo, trailerUrl, handleMouseEnter, handleMouseLeave } = useTrailerHover(id, media_type)
  const [isTitleVisible, setIsTitleVisible] = useState(false)

  useEffect(() => {
    let timeoutId
    if (showVideo) {
      timeoutId = setTimeout(() => {
        setIsTitleVisible(true)
      }, 1000)
    } else {
      setIsTitleVisible(false)
    }
    return () => clearTimeout(timeoutId)
  }, [showVideo])

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
          style={{ backgroundImage: `url(${API_IMG}/${poster_path || backdrop_path})` }}
        >
          {/* Video Trailer Overlay */}
          <CardTrailerOverlay show={showVideo} trailerUrl={trailerUrl} title={title} />
          
          {/* Animated Title Overlay */}
          <div className={`card__title ${isTitleVisible ? 'card__title--visible' : ''}`}>
            {title}
          </div>

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
    </Link>
  )
}

export default ProviderContentCard
