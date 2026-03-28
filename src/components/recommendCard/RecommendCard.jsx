import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_IMG } from '../../constants/api'
import useTrailerHover from '../../hooks/useTrailerHover'
import CardTrailerOverlay from '../common/CardTrailerOverlay'
import { FaStar } from 'react-icons/fa6'
import './RecommendCard.css'

const getBackdropUrl = (path) =>
  path ? `https://wsrv.nl/?url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw780${path}&output=webp&q=65&n=-1` : null

const RecommendCard = ({ item }) => {
  const { id, media_type, poster_path, backdrop_path, vote_average } = item
  const title = item.title || item.name || item.original_title || item.original_name
  const rating = vote_average ? vote_average.toFixed(1) : '—'
  const to = media_type === 'tv' ? `/tv/${id}` : `/movie/${id}`
  const mediaTypeLabel = media_type === 'tv' ? 'SERIES' : 'MOVIE'
  
  const imageSrc = getBackdropUrl(backdrop_path) || getBackdropUrl(poster_path) || ''

  const { isHovered, showVideo, trailerUrl, titleBackdrop, handleMouseEnter, handleMouseLeave } = 
    useTrailerHover(id, media_type, backdrop_path)
  
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
      className={`recommend-card ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className='recommend-card__media-wrapper'>
        <div
          className='recommend-card__media'
          style={{ backgroundImage: `url(${titleBackdrop || imageSrc})` }}
        >
          {/* Video Trailer Overlay */}
          <CardTrailerOverlay show={showVideo} trailerUrl={trailerUrl} title={title} />
          
          {/* Animated Title Overlay */}
          <div className={`card__title ${isTitleVisible ? 'card__title--visible' : ''}`}>
            {title}
          </div>

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
    </Link>
  )
}

export default RecommendCard
