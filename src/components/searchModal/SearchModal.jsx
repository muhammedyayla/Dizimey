import React, { useState, useEffect, useCallback, useRef } from 'react'
import { MdSearch, MdClose, MdExpandMore, MdPlayArrow, MdInfo } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { API_KEY } from '../../constants/api'
import { setPlayerConfig } from '../../redux/slices/playerSlice'
import './SearchModal.css'

const SEARCH_MODAL_TABS = [
  { id: 'multi', label: 'Movies & Series', endpoint: 'https://api.themoviedb.org/3/search/multi' },
  { id: 'movie', label: 'Movies', endpoint: 'https://api.themoviedb.org/3/search/movie' },
  { id: 'tv', label: 'Series', endpoint: 'https://api.themoviedb.org/3/search/tv' },
  { id: 'anime', label: 'Animes', endpoint: 'https://api.themoviedb.org/3/search/tv', genre: 16 },
]

const SearchItem = ({ item, isExpanded, onToggle, onCloseModal }) => {
  const dispatch = useDispatch()
  const { genres } = useSelector((state) => state.genre)
  
  const title = item.title || item.name || item.original_title || item.original_name
  const year = (item.release_date || item.first_air_date)?.split('-')[0]
  const rating = item.vote_average ? item.vote_average.toFixed(1) : '—'
  const mediaType = item.media_type === 'tv' ? 'TV Show' : 'Movie'
  const typeKey = item.media_type === 'tv' ? 'tv' : 'movie'
  const detailPath = `/${typeKey}/${item.id}`
  
  const genreNames = item.genre_ids 
    ? item.genre_ids.map(id => genres.find(g => g.id === id)?.name).filter(Boolean).slice(0, 2).join(', ')
    : ''

  const thumbUrl = item.poster_path 
    ? `https://wsrv.nl/?url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw92${item.poster_path}&w=48&h=64&fit=cover&output=webp`
    : null

  const handlePlay = (e) => {
    e.stopPropagation()
    dispatch(setPlayerConfig({
      mediaType: typeKey,
      tmdbId: item.id,
      title: title,
      posterPath: item.poster_path
    }))
    onCloseModal()
  }

  return (
    <div className={`search-modal__item ${isExpanded ? 'is-expanded' : ''}`}>
      <div className='search-modal__item-header' onClick={onToggle}>
        <div className='search-modal__item-thumb'>
          {thumbUrl ? (
            <img src={thumbUrl} alt={title} />
          ) : (
            <div className='search-modal__item-thumb-placeholder'>{title.charAt(0)}</div>
          )}
        </div>
        
        <div className='search-modal__item-info'>
          <h4 className='search-modal__item-title'>{title}</h4>
          <p className='search-modal__item-meta'>
            {mediaType} • {year} • ⭐ {rating} {genreNames && `• ${genreNames}`}
          </p>
        </div>

        <div className='search-modal__item-chevron'>
          <MdExpandMore />
        </div>
      </div>

      {isExpanded && (
        <div className='search-modal__item-details'>
          <p className='search-modal__item-overview'>{item.overview || 'No description available.'}</p>
          <div className='search-modal__item-actions'>
            <button className='search-modal__btn search-modal__btn--play' onClick={handlePlay}>
              <MdPlayArrow /> Play
            </button>
            <Link to={detailPath} className='search-modal__btn search-modal__btn--more' onClick={onCloseModal}>
              <MdInfo /> See More
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

const SearchModal = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('multi')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      setExpandedId(null) // Reset expanded state on close
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [open])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const performSearch = useCallback(async (searchQuery, tabId) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    const tab = SEARCH_MODAL_TABS.find(t => t.id === tabId)
    
    try {
      let url = `${tab.endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&language=tr-TR&page=1&include_adult=false`
      
      if (tabId === 'anime' && tab.genre) {
        url += `&with_genres=${tab.genre}`
      }

      const res = await axios.get(url)
      let data = res.data.results || []

      if (tabId === 'anime') {
        data = data.filter(item => item.genre_ids?.includes(16))
      }

      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query, activeTab)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, activeTab, performSearch])

  if (!open) return null

  return (
    <div className='search-modal' onClick={onClose}>
      <div className='search-modal__container' onClick={(e) => e.stopPropagation()}>
        <div className='search-modal__header'>
          <h2>Search</h2>
          <button className='search-modal__close' onClick={onClose} aria-label='Close search'>
            <MdClose />
          </button>
        </div>

        <div className='search-modal__tabs'>
          {SEARCH_MODAL_TABS.map(tab => (
            <button
              key={tab.id}
              className={`search-modal__tab ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className='search-modal__search-box'>
          <MdSearch className='search-modal__search-icon' />
          <input
            ref={inputRef}
            type='text'
            placeholder='Type here to search...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className='search-modal__results'>
          {loading ? (
             <div className='search-modal__state'>Searching...</div>
          ) : results.length > 0 ? (
            <div className='search-modal__list'>
              {results.map(item => {
                const itemId = item.id
                const mediaType = item.media_type || (activeTab === 'movie' ? 'movie' : 'tv')
                return (
                  <SearchItem 
                    key={itemId} 
                    item={{...item, media_type: mediaType}}
                    isExpanded={expandedId === itemId}
                    onToggle={() => setExpandedId(expandedId === itemId ? null : itemId)}
                    onCloseModal={onClose}
                  />
                )
              })}
            </div>
          ) : query.trim() ? (
            <div className='search-modal__state'>No results found for "{query}"</div>
          ) : (
            <div className='search-modal__state'>Start typing to find movies, series and more...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal
