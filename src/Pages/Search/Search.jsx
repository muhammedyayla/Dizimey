import React, { useEffect, useMemo, useState } from 'react'
import './Search.css'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../../components/movieCard/movieCard'
import Loading from '../../components/Loading/Loading'
import { API_KEY } from '../../constants/api'

const LANGUAGE_TR = 'tr-TR'
const LANGUAGE_EN = 'en-US'
const MAX_RESULTS_PER_PAGE = 20

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''
  const currentPage = Number(searchParams.get('page') || 1)

  const [results, setResults] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([])
        setTotalPages(0)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const [trRes, enRes] = await Promise.all([
          axios.get('https://api.themoviedb.org/3/search/multi', {
            params: {
              api_key: API_KEY,
              language: LANGUAGE_TR,
              query,
              include_adult: false,
              page: currentPage,
            },
          }),
          axios.get('https://api.themoviedb.org/3/search/multi', {
            params: {
              api_key: API_KEY,
              language: LANGUAGE_EN,
              query,
              include_adult: false,
              page: currentPage,
            },
          })
        ])

        const trFiltered = (trRes.data.results || []).filter((item) =>
          ['movie', 'tv'].includes(item.media_type)
        )
        const enFiltered = (enRes.data.results || []).filter((item) =>
          ['movie', 'tv'].includes(item.media_type)
        )

        const enMap = new Map(enFiltered.map(m => [`${m.media_type}-${m.id}`, m]))
        const merged = trFiltered.map(trItem => {
          const enItem = enMap.get(`${trItem.media_type}-${trItem.id}`)
          return {
            ...trItem,
            title: enItem?.title || trItem.title,
            name: enItem?.name || trItem.name,
            original_title: enItem?.original_title || trItem.original_title,
            original_name: enItem?.original_name || trItem.original_name
          }
        })

        setResults(merged)
        setTotalPages(Math.min(trRes.data.total_pages, 50))
      } catch (err) {
        setError('Arama yapılırken bir hata oluştu.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, currentPage])

  const handlePageChange = (page) => {
    const safePage = Math.min(Math.max(page, 1), totalPages || 1)
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', safePage)
    setSearchParams(nextParams)
  }

  const paginatedResults = useMemo(() => results.slice(0, MAX_RESULTS_PER_PAGE), [results])

  return (
    <div className='search-page'>
      <div className='search-page__header'>
        {query ? <h1>&ldquo;{query}&rdquo; araması</h1> : <h1>Bir içerik arayın</h1>}
        <p>Sonuçlar Türkçe açıklamalarla, İngilizce başlıklarla listelenir.</p>
      </div>

      {loading && (
        <div className='search-page__state'>
          <Loading />
        </div>
      )}

      {!loading && error && <div className='search-page__state'>{error}</div>}

      {!loading && !error && query && paginatedResults.length === 0 && (
        <div className='search-page__state'>Sonuç bulunamadı.</div>
      )}

      {!loading && paginatedResults.length > 0 && (
        <>
          <div className='search-grid'>
            {paginatedResults.map((item) => (
              <MovieCard key={`${item.media_type}-${item.id}-${item.poster_path}`} movie={item} />
            ))}
          </div>
          <div className='search-pagination'>
            <button
              type='button'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Önceki
            </button>
            <span>
              Sayfa {currentPage} / {totalPages || 1}
            </span>
            <button
              type='button'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={totalPages === 0 || currentPage >= totalPages}
            >
              Sonraki
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Search

