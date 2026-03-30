import React, { useState, useEffect } from 'react'
import { API_IMG } from '../../constants/api'
import './movieCard.css'
import { FaStar } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import useTrailerHover from '../../hooks/useTrailerHover'
import CardTrailerOverlay from '../common/CardTrailerOverlay'

const getImageUrl = (path) =>
  path ? `https://wsrv.nl/?url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw342${path}&output=webp&q=50&n=-1` : null


const MovieCard = ({ movie }) => {
  const { id, vote_average, poster_path, backdrop_path, media_type } = movie
  const rating = vote_average ? vote_average.toFixed(1) : '—'
  const displayTitle =
    movie?.title || movie?.name || movie?.original_title || movie?.original_name || 'İsimsiz İçerik'
  
  const imageSrc = getImageUrl(poster_path) || getImageUrl(backdrop_path) || ''
  const mediaTypeLabel = media_type === 'tv' ? 'SERIES' : 'MOVIE'
  
  const detailPath = media_type === 'tv' ? `/tv/${id}` : `/movie/${id}`

  const { isHovered, showVideo, trailerUrl, handleMouseEnter, handleMouseLeave } = 
    useTrailerHover(id, media_type, poster_path)

  
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
      to={detailPath} 
      className={`movie-card ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className='movie-card__media'>
        {/* Poster */}
        {imageSrc ? (
          <img src={imageSrc} alt={displayTitle} loading='lazy' className={showVideo ? 'hidden' : ''} />
        ) : (
          <div className='movie-card__placeholder' aria-hidden="true">
            {displayTitle.charAt(0)}
          </div>
        )}

        {/* Video Trailer Overlay */}
        <CardTrailerOverlay show={showVideo} trailerUrl={trailerUrl} title={displayTitle} />

        {/* Animated Title Overlay */}
        <div className={`card__title ${isTitleVisible ? 'card__title--visible' : ''}`}>
          {displayTitle}
        </div>

        {/* Top Badges (Permanent) */}
        <div className='movie-card__badge movie-card__badge--type'>
          {mediaTypeLabel}
        </div>
        <div className='movie-card__badge movie-card__badge--rating'>
          <FaStar aria-hidden="true" />
          <span>{rating}</span>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard