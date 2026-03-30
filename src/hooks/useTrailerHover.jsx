import { useState, useRef, useCallback } from 'react'
import axios from 'axios'
import { API_KEY, API_MOVIE_VIDEOS_URL, API_TV_VIDEOS_URL } from '../constants/api'

const useTrailerHover = (id, mediaType = 'movie', originalBackdrop = null) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const trailerUrlRef = useRef(null)
  const hoverTimerRef = useRef(null)

  const getImageUrl = (file_path) =>
    `https://wsrv.nl/?url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw342${file_path}&output=webp&q=50&n=-1`

  const fetchVideo = useCallback(async () => {
    if (trailerUrlRef.current) return trailerUrlRef.current

    try {
      const baseUrl = mediaType === 'tv' ? API_TV_VIDEOS_URL : API_MOVIE_VIDEOS_URL
      const res = await axios.get(`${baseUrl}/${id}/videos?api_key=${API_KEY}`)

      const videos = res.data.results || []
      const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos[0]

      if (trailer) {
        trailerUrlRef.current = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&rel=0&iv_load_policy=3&showinfo=0&modestbranding=1`
      }
      return trailerUrlRef.current
    } catch (error) {
      console.error('Trailer fetch error:', error)
      return null
    }
  }, [id, mediaType])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    hoverTimerRef.current = setTimeout(async () => {
      fetchVideo().then((vUrl) => {
        if (vUrl) setShowVideo(true)
      })
    }, 500)
  }, [fetchVideo])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setShowVideo(false)
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }
  }, [])

  return {
    isHovered,
    showVideo,
    trailerUrl: trailerUrlRef.current,
    handleMouseEnter,
    handleMouseLeave
  }
}

export default useTrailerHover
