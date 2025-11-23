import React, { useEffect, useMemo, useState } from 'react'
import './playerModal.css'

const BRAND_COLOR = 'ea2a33'

const buildPlayerSrc = ({ mediaType, tmdbId, season, episode }) => {
  if (!tmdbId) return ''

  const params = new URLSearchParams({
    color: BRAND_COLOR,
    autoPlay: 'true',
  })

  if (mediaType === 'tv') {
    params.set('nextEpisode', 'true')
    params.set('episodeSelector', 'true')
  }

  const base =
    mediaType === 'tv'
      ? `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}`
      : `https://www.vidking.net/embed/movie/${tmdbId}`

  return `${base}?${params.toString()}`
}

const PlayerModal = ({ open, onClose, mediaType = 'movie', tmdbId, title, season: initialSeason, episode: initialEpisode }) => {
  const [season, setSeason] = useState(initialSeason || 1)
  const [episode, setEpisode] = useState(initialEpisode || 1)
  const [lastEvent, setLastEvent] = useState(null)

  useEffect(() => {
    if (!open) return undefined

    const handleMessage = (event) => {
      if (typeof event.data !== 'string') return
      try {
        const payload = JSON.parse(event.data)
        if (payload?.type === 'PLAYER_EVENT') {
          setLastEvent(payload.data)
          localStorage.setItem(`player-progress-${tmdbId}`, JSON.stringify(payload.data))
        }
      } catch {
        // yoksay
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [open, tmdbId])

  useEffect(() => {
    if (!open) return
    if (initialSeason) setSeason(initialSeason)
    if (initialEpisode) setEpisode(initialEpisode)
  }, [open, tmdbId, mediaType, initialSeason, initialEpisode])

  const src = useMemo(
    () => buildPlayerSrc({ mediaType, tmdbId, season, episode }),
    [mediaType, tmdbId, season, episode]
  )

  if (!open) return null

  return (
    <div className='player-modal'>
      <div className='player-modal__backdrop' onClick={onClose} />
      <div className='player-modal__body'>
        <div className='player-modal__header'>
          <div>
            <p className='player-modal__eyebrow'>VidKing Player</p>
            <h4>{title}</h4>
          </div>
          <button type='button' className='player-modal__close' onClick={onClose} aria-label='Kapat'>
            ×
          </button>
        </div>

        {mediaType === 'tv' && (
          <div className='player-modal__controls'>
            <label>
              <span>Sezon</span>
              <input
                type='number'
                min={1}
                value={season}
                onChange={(e) => setSeason(Math.max(1, Number(e.target.value)))}
              />
            </label>
            <label>
              <span>Bölüm</span>
              <input
                type='number'
                min={1}
                value={episode}
                onChange={(e) => setEpisode(Math.max(1, Number(e.target.value)))}
              />
            </label>
          </div>
        )}

        <div className='player-modal__iframe'>
          <iframe
            title='VidKing Player'
            src={src}
            width='100%'
            height='100%'
            allow='autoplay; fullscreen'
            frameBorder='0'
            allowFullScreen
          />
        </div>

        {lastEvent && (
          <div className='player-modal__event'>
            <p>
              Son olay: <strong>{lastEvent.event}</strong> • İlerleme: % {lastEvent.progress?.toFixed?.(1)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerModal

