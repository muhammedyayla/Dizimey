import React from 'react'
import './CardTrailerOverlay.css'

const CardTrailerOverlay = ({ show, trailerUrl, title }) => {
  if (!show || !trailerUrl) return null

  return (
    <div className='card-trailer-overlay'>
       <iframe
        src={trailerUrl}
        title={title}
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

export default CardTrailerOverlay
