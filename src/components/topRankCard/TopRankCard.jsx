import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { API_IMG } from '../../constants/api'
import { FaStar } from 'react-icons/fa6'
import './TopRankCard.css'

const TopRankCard = ({ movie, index, genre }) => {
  const { id, vote_average, poster_path, media_type } = movie
  const rating = vote_average ? vote_average.toFixed(1) : '—'
  const title = movie.title || movie.name
  const year = movie.release_date || movie.first_air_date ? new Date(movie.release_date || movie.first_air_date).getFullYear() : ''
  const itemPath = media_type === 'tv' ? `/tv/${id}` : `/movie/${id}`

  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      to={itemPath}
      className={`top-rank-card ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className='top-rank-card__number'>{index + 1}</span>
      <div className='top-rank-card__poster-wrapper'>
        <div
          className='top-rank-card__poster'
          style={{ backgroundImage: `url(${API_IMG}/${poster_path})` }}
        >


          {/* Top Badge (IMDb only for Top 10) */}
          <div className='top-rank-card__badge'>
            <FaStar aria-hidden="true" />
            <span>{rating}</span>
          </div>

          <div className='top-rank-card__hover'>
            <div className='top-rank-card__hover-left'>
              <span className='top-rank-card__hover-title'>{title}</span>
              <span className='top-rank-card__hover-genre'>{genre}</span>
            </div>
            <div className='top-rank-card__hover-right'>
              <span className='top-rank-card__hover-year'>{year}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TopRankCard
