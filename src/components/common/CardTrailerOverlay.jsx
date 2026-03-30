import React, { useState, useRef, useEffect } from 'react'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md'
import './CardTrailerOverlay.css'

const CardTrailerOverlay = ({ show, trailerUrl, title }) => {
  const [isMuted, setIsMuted] = useState(true)
  const iframeRef = useRef(null)

  // URL'ye enablejsapi=1 ekle
  const videoSrc = trailerUrl ? `${trailerUrl}${trailerUrl.includes('?') ? '&' : '?'}enablejsapi=1` : ''

  const toggleMute = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!iframeRef.current) return

    try {
      const newMuted = !isMuted
      const command = newMuted ? 'mute' : 'unMute'
      
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      )
      setIsMuted(newMuted)
    } catch (error) {
      // Sessizce geç
    }
  }

  // Hover bitince resetle
  useEffect(() => {
    return () => setIsMuted(true)
  }, [])

  if (!show || !trailerUrl) return null

  return (
    <div className='card-trailer-overlay'>
      <iframe
        ref={iframeRef}
        src={videoSrc}
        title={title}
        frameBorder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      <button 
        className='card-trailer__volume' 
        onClick={toggleMute}
        onMouseEnter={(e) => e.stopPropagation()}
        title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
      >
        {isMuted ? <MdVolumeOff /> : <MdVolumeUp />}
      </button>
    </div>
  )
}

export default CardTrailerOverlay
