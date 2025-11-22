import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateWatchProgress } from '../../redux/slices/watchProgressSlice'
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

const PlayerModal = ({ open, onClose, mediaType = 'movie', tmdbId, title, season: initialSeason, episode: initialEpisode, posterPath, backdropPath }) => {
  const dispatch = useDispatch()
  const [season, setSeason] = useState(initialSeason || 1)
  const [episode, setEpisode] = useState(initialEpisode || 1)
  const [lastEvent, setLastEvent] = useState(null)
  const [totalDuration, setTotalDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (!open) return undefined

    const handleMessage = async (event) => {
      if (typeof event.data !== 'string') return
      try {
        const payload = JSON.parse(event.data)
        if (payload?.type === 'PLAYER_EVENT') {
          setLastEvent(payload.data)
          
          const eventData = payload.data
          // VidKing player sends progress as percentage (0-100)
          const progressPercent = eventData.progress || 0
          // currentTime is in seconds
          const current = eventData.currentTime || Math.round(eventData.timestamp / 1000) || 0
          // duration is total duration in seconds
          const total = eventData.duration || 0
          
          setCurrentTime(current)
          setTotalDuration(total)
          
          // Save progress to database only on significant events (play, pause, ended, seeked) or every 10 seconds
          const shouldSave = ['play', 'pause', 'ended', 'seeked'].includes(eventData.event) || 
                            (eventData.event === 'timeupdate' && current % 10 < 1) // Save every ~10 seconds
          
          const token = localStorage.getItem('token')
          if (token && tmdbId && title && shouldSave) {
            try {
              await dispatch(updateWatchProgress({
                tmdbId: parseInt(tmdbId),
                mediaType: eventData.mediaType || mediaType,
                title,
                posterPath,
                backdropPath,
                progressPercent,
                currentTime: Math.round(current),
                totalDuration: Math.round(total),
                seasonNumber: (eventData.season || (mediaType === 'tv' ? season : null)) ? parseInt(eventData.season || season) : null,
                episodeNumber: (eventData.episode || (mediaType === 'tv' ? episode : null)) ? parseInt(eventData.episode || episode) : null
              })).unwrap()
            } catch (error) {
              console.error('Failed to save watch progress:', error)
            }
          }
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

