import { getContinueEntry, buildContinueKey } from '../../constants/playerProgress'
import { MdMovieFilter } from 'react-icons/md'
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

  const persistContinueProgress = useCallback((manualEvent = null) => {
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
  }, [continueMeta, lastEvent])

  const closePlayer = useCallback(() => {
    persistContinueProgress()
    onClose()
  }, [persistContinueProgress, onClose])

  // Tam ekran fonksiyonu
  const handleFullscreen = useCallback(() => {
    const el = playerWrapperRef.current
    if (!el || playerNotFound) return

    const isMobile = window.innerWidth <= 768

    if (el.requestFullscreen) el.requestFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen()
    else if (el.msRequestFullscreen) el.msRequestFullscreen()
    else if (isMobile && import.meta.env.DEV) {
      console.warn('PlayerModal: Fullscreen API not supported')
    }
  }, [playerNotFound])

  // Modal açıldığında mümkünse player sarmalayıcıyı tam ekran yap (Android vb.; iOS çoğu zaman yoksayar)
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      handleFullscreen()
    }, 400)
    return () => clearTimeout(timer)
  }, [open, tmdbId, handleFullscreen])

  // Arka plan scroll kilidi (özellikle mobil Safari: yalnız overflow yetmez)
  useEffect(() => {
    if (!open) return undefined

    const html = document.documentElement
    const body = document.body
    const scrollY = window.scrollY || window.pageYOffset || 0

    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
    }

    html.classList.add('player-open')
    body.classList.add('player-open')
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'

    return () => {
      html.classList.remove('player-open')
      body.classList.remove('player-open')
      html.style.overflow = prev.htmlOverflow
      body.style.overflow = prev.bodyOverflow
      body.style.position = prev.bodyPosition
      body.style.top = prev.bodyTop
      body.style.left = prev.bodyLeft
      body.style.right = prev.bodyRight
      body.style.width = prev.bodyWidth
      window.scrollTo(0, scrollY)
    }
  }, [open])

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

  // Tam ekrandan çıkıldığında modal açık kalsın; ilerlemeyi kaydet
  useEffect(() => {
    if (!open) return

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        persistContinueProgress()
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [open, persistContinueProgress])

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

  useEffect(() => {
    if (!open) return
    setPlayerNotFound(false)
  }, [open, src])

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
              onError={() => setPlayerNotFound(true)}
            />
          )}
        </div>

        {import.meta.env.DEV && lastEvent && (
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


