import React, { useEffect, useMemo, useRef, useState } from 'react'
import './playerModal.css'

const BRAND_COLOR = 'ea2a33'

const buildPlayerSrc = ({ mediaType, tmdbId, season, episode }) => {
  if (!tmdbId) return ''

  // Base URL'i environment variable'dan alıyoruz (VITE_PLAYER_BASE_URL)
  // Bu sayede kod içerisinde açıkça "vidking.net" görünmez.
  const playerBase = import.meta.env.VITE_PLAYER_BASE_URL || 'https://www.vidking.net/embed'

  const params = new URLSearchParams({
    color: BRAND_COLOR,
    autoPlay: 'true',
  })

  if (mediaType === 'tv') {
    params.set('nextEpisode', 'true')
    params.set('episodeSelector', 'true')
  }

  const path =
    mediaType === 'tv'
      ? `tv/${tmdbId}/${season}/${episode}`
      : `movie/${tmdbId}`

  return `${playerBase}/${path}?${params.toString()}`
}

const PlayerModal = ({ open, onClose, mediaType = 'movie', tmdbId, title, season: initialSeason, episode: initialEpisode }) => {
  const [season, setSeason] = useState(initialSeason || 1)
  const [episode, setEpisode] = useState(initialEpisode || 1)
  const [lastEvent, setLastEvent] = useState(null)
  const playerWrapperRef = useRef(null)

  // Tam ekran fonksiyonu
  const handleFullscreen = () => {
    const el = playerWrapperRef.current
    if (!el) return
    if (el.requestFullscreen) el.requestFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen()
    else if (el.msRequestFullscreen) el.msRequestFullscreen()
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
        onClose()
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
  }, [open, onClose])

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
            <p className='player-modal__eyebrow'>Player</p>
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

        <div ref={playerWrapperRef} className='player-wrapper'>
          <iframe
            title='Media Player'
            src={src}
            width='100%'
            height='100%'
            allow='autoplay; fullscreen'
            frameBorder='0'
            allowFullScreen
            // Sandbox ile reklamları ve pop-up'ları engelliyoruz
            // allow-popups ve allow-top-navigation kaldırıldı
            sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-presentation"
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


