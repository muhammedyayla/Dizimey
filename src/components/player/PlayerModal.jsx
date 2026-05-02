import { getContinueEntry, buildContinueKey, clearContinueEntry } from '../../constants/playerProgress'
import { MdMovieFilter } from 'react-icons/md'
import { useState, useEffect, useRef, useMemo } from 'react';
import './playerModal.css'



const BRAND_COLOR = 'ea2a33'

const buildPlayerSrc = ({ mediaType, tmdbId, season, episode, startTime }) => {
  if (!tmdbId) return ''

  const playerBase = import.meta.env.VITE_PLAYER_BASE_URL || 'https://www.vidking.net/embed'
  const params = new URLSearchParams({
    color: BRAND_COLOR,
    autoPlay: 'true',
  })

  if (mediaType === 'tv') {
    params.set('nextEpisode', 'true')
    params.set('episodeSelector', 'true')
  }

  if (Number(startTime) > 0) {
    params.set('startTime', String(Math.floor(startTime)))
  }

  const path = mediaType === 'tv'
    ? `tv/${tmdbId}/${season}/${episode}`
    : `movie/${tmdbId}`

  return `${playerBase}/${path}?${params.toString()}`
}

const PlayerModal = ({
  open,
  onClose,
  mediaType = 'movie',
  tmdbId,
  title,
  season: initialSeason,
  episode: initialEpisode,
  startTime = 0,
  posterPath = '',
  onPlayerEvent,
}) => {
  const [season, setSeason] = useState(initialSeason || 1)
  const [episode, setEpisode] = useState(initialEpisode || 1)
  const [lastEvent, setLastEvent] = useState(null)
  const [playerNotFound, setPlayerNotFound] = useState(false)

  const playerWrapperRef = useRef(null)

  const continueMeta = useMemo(() => {
    if (!tmdbId) return null
    const isMovie = mediaType !== 'tv'
    return {
      type: isMovie ? 'movie' : 'episode',
      id: Number(tmdbId),
      season,
      episode,
      title: title || '',
      poster_path: posterPath || '',
    }
  }, [tmdbId, mediaType, season, episode, title, posterPath])

  const resumeTime = useMemo(() => {
    if (!continueMeta) return 0
    const entry = getContinueEntry(continueMeta)
    if (!entry) return 0
    return Number(entry.time) || 0
  }, [continueMeta])

  const persistContinueProgress = (manualEvent = null) => {
    if (!continueMeta) return
    const eventToUse = manualEvent || lastEvent
    if (!eventToUse) return

    const rawTime = Number(eventToUse.currentTime ?? eventToUse.time ?? eventToUse.current_time)
    const rawDuration = Number(eventToUse.duration ?? eventToUse.totalDuration ?? eventToUse.total_duration)
    if (!Number.isFinite(rawTime) || !Number.isFinite(rawDuration) || rawDuration <= 0) return

    const payload = {
      time: Math.max(0, rawTime),
      duration: Math.max(1, rawDuration),
      title: continueMeta.title,
      poster_path: continueMeta.poster_path,
      type: continueMeta.type,
      id: continueMeta.id,
      updatedAt: Date.now(),
    }

    if (continueMeta.type === 'episode') {
      payload.season = continueMeta.season
      payload.episode = continueMeta.episode
    }

    const key = buildContinueKey(continueMeta)
    localStorage.setItem(key, JSON.stringify(payload))
  }

  const clearContinueProgress = () => {
    if (!continueMeta) return
    clearContinueEntry(continueMeta)
  }

  const closePlayer = () => {
    persistContinueProgress()
    onClose()
  }

  // Tam ekran fonksiyonu
  const handleFullscreen = () => {
    const el = playerWrapperRef.current
    if (!el || playerNotFound) return
    
    // Mobilde tam ekran isteği
    const isMobile = window.innerWidth <= 768
    
    if (el.requestFullscreen) el.requestFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen()
    else if (el.msRequestFullscreen) el.msRequestFullscreen()
    else if (isMobile) {
      // Fullscreen API yoksa (iOS Safari vb.) CSS fallback zaten class ile hallolacak
      console.log('Fullscreen API not supported, using CSS fallback')
    }

  }

  // Modal açıldığında player'ı tam ekrana al
  useEffect(() => {
    if (!open) return
    // Kısa gecikme: modal DOM'a yerleştikten sonra fullscreen isteği gönder
    const timer = setTimeout(() => {
      handleFullscreen()
    }, 300)
    return () => clearTimeout(timer)
  }, [open, tmdbId])

  // Modal açıkken site genelinde (iframe hariç) sağ tık engelle
  // (Çapraz domain (cross-origin) iframe içine tarayıcı güvenliği gereği müdahale edilemez 
  // ancak wrapper ve çevresi korunur)
  useEffect(() => {
    if (!open) return
    const blockContext = (e) => e.preventDefault()
    window.addEventListener('contextmenu', blockContext)

    // Wrapper özelinde de dinleyiciyi ekle
    const el = playerWrapperRef.current
    if (el) el.addEventListener('contextmenu', blockContext)

    return () => {
      window.removeEventListener('contextmenu', blockContext)
      if (el) el.removeEventListener('contextmenu', blockContext)
    }
  }, [open])

  // ESC ile tam ekrandan çıkılınca modal da kapansın
  // Ayrıca tam ekrandayken sağ tık engelle
  useEffect(() => {
    if (!open) return

    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement

      if (!isFullscreen) {
        // Tam ekrandan çıkıldı (ESC veya buton) → modal'ı kapat
        closePlayer()
      } else {
        // Tam ekrana girildi → sağ tık engelle
        const blockContext = (e) => e.preventDefault()
        document.addEventListener('contextmenu', blockContext)
        const cleanup = () => {
          document.removeEventListener('contextmenu', blockContext)
          document.removeEventListener('fullscreenchange', cleanup)
        }
        document.addEventListener('fullscreenchange', cleanup)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [open, onClose, lastEvent, continueMeta])

  useEffect(() => {
    if (!open) return undefined

    const handleMessage = (event) => {
      if (typeof event.data !== 'string' && typeof event.data !== 'object') return

      try {
        const payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data

        // Vidking Eventleri
        if (payload?.type === 'PLAYER_EVENT') {
          setLastEvent(payload.data)
          localStorage.setItem(`player-progress-${tmdbId}`, JSON.stringify(payload.data))
          if (typeof onPlayerEvent === 'function') {
            onPlayerEvent(payload.data)
          }
        }
      } catch {
        // yoksay
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [open, tmdbId, onPlayerEvent, continueMeta])

  useEffect(() => {
    if (!open) return
    if (initialSeason) setSeason(initialSeason)
    if (initialEpisode) setEpisode(initialEpisode)
  }, [open, tmdbId, mediaType, initialSeason, initialEpisode])

  const src = useMemo(
    () => buildPlayerSrc({
      mediaType,
      tmdbId,
      season,
      episode,
      startTime: startTime || resumeTime,
    }),
    [mediaType, tmdbId, season, episode, startTime, resumeTime]
  )


  if (!open) return null

  return (
    <div className='player-modal'>
      <div className='player-modal__backdrop' onClick={closePlayer} />
      <div className='player-modal__body'>
        <div className='player-modal__header'>
          <div>
            <p className='player-modal__eyebrow'>Player</p>
            <h4>{title}</h4>
          </div>
          <button type='button' className='player-modal__close' onClick={closePlayer} aria-label='Kapat'>
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

        <div
          ref={playerWrapperRef}
          className='player-wrapper'
        >

          {playerNotFound ? (
            <div className="player-not-found">
              <MdMovieFilter size={64} />
              <h3>İçerik Bulunamadı</h3>
              <p>Bu içerik şu an mevcut değil, yakında eklenecek.</p>
            </div>
          ) : (
            <iframe
              title='Media Player'
              src={src}
              width='100%'
              height='100%'
              allow='autoplay; fullscreen; encrypted-media; picture-in-picture'
              frameBorder='0'
              allowFullScreen
              referrerPolicy='no-referrer-when-downgrade'
            />
          )}
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


