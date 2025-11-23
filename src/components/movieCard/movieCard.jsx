import React from 'react'
import { API_IMG } from '../../constants/api'
import './movieCard.css'
import { FaStar } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const MovieCard = ({ movie }) => {
  const { id, vote_average, poster_path, media_type } = movie
  const rating = vote_average ? vote_average.toFixed(1) : '—'
  const displayTitle =
    movie?.title || movie?.name || movie?.original_title || movie?.original_name || 'İsimsiz İçerik'
  const imageSrc = poster_path ? `${API_IMG}/${poster_path}` : ''
  const mediaTypeLabel = media_type === 'tv' ? 'TV Show' : 'Movie'
  
  const detailPath = media_type === 'tv' ? `/tv/${id}` : `/movie/${id}`

  return (
    <Link to={detailPath} className='movie-card'>
      <div className='movie-card__media'>
        {imageSrc ? (
          <img src={imageSrc} alt={displayTitle} loading='lazy' />
        ) : (
          <div className='movie-card__placeholder' aria-hidden="true">
            {displayTitle.charAt(0)}
          </div>
        )}
        <div className='movie-card__overlay' />
        <div className='movie-card__hover-info'>
          <h4 className='movie-card__hover-title'>{displayTitle}</h4>
          <div className='movie-card__hover-meta'>
            <span className='movie-card__hover-type'>{mediaTypeLabel}</span>
            <div className='movie-card__hover-rating'>
              <FaStar aria-hidden="true" />
              <span>{rating}</span>
            </div>
          </div>
        </div>
        <div className='movie-card__rating'>
          <FaStar aria-hidden="true" />
          <span>{rating}</span>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard