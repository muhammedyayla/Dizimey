import React, { useEffect, useMemo, useState } from 'react'
import './Home.css'
import Genres from '../../components/genres/genres'
import MovieCard from '../../components/movieCard/movieCard'
import SwiperSection from '../../components/swiperSection/SwiperSection'
import HeroSwiper from '../../components/heroSwiper/HeroSwiper'
import WatchProviders from '../../components/watchProviders/WatchProviders'
import Tabs from '../../components/tabs/Tabs'
import { useDispatch, useSelector } from 'react-redux'
import { getMovieList, getMovieListByGenre, getTopRatedMovies, getTopRatedTv, getTrending } from '../../redux/slices/movieListSlice'
import { API_IMG } from '../../constants/api'
import { getAllContinueEntries } from '../../constants/playerProgress'
import Loading from '../../components/Loading/Loading'
import { Link } from 'react-router-dom'
import { setPlayerConfig } from '../../redux/slices/playerSlice'
import TopRankCard from '../../components/topRankCard/TopRankCard'

const getEnglishTitle = (item) =>
  item?.title || item?.name || item?.original_title || item?.original_name || ''

const Home = () => {
  const dispatch = useDispatch()
  const { movieList, topRatedMovies, topRatedTv, trending } = useSelector((store) => store.movieList)
  const { genres } = useSelector((store) => store.genre)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [topRatedTab, setTopRatedTab] = useState('movies')
  const [continueEntries, setContinueEntries] = useState([])

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      setIsFetching(true)
      try {
        if (selectedGenre) {
          await dispatch(getMovieListByGenre(selectedGenre.id)).unwrap()
        } else {
          await dispatch(getMovieList()).unwrap()
        }
      } catch (error) {
        console.error('Film listesi alınırken hata oluştu', error)
      } finally {
        if (isMounted) {
          setIsFetching(false)
        }
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [dispatch, selectedGenre])

  useEffect(() => {
    dispatch(getTopRatedMovies())
    dispatch(getTopRatedTv())
    dispatch(getTrending())
  }, [dispatch])

  useEffect(() => {
    setContinueEntries(getAllContinueEntries())
  }, [])

  // Genre ID'den isim bulma yardımcısı
  const getGenreName = (genreIds) => {
    if (!genreIds || genreIds.length === 0) return ''
    const genre = genres.find(g => g.id === genreIds[0])
    return genre ? genre.name : ''
  }

  const featuredMovies = useMemo(() => trending.slice(0, 10), [trending])
  const topTen = useMemo(() => movieList.slice(0, 10), [movieList])
  const trendingNow = useMemo(() => movieList.slice(10, 16), [movieList])
  const topRatedList = useMemo(() => topRatedTab === 'movies' ? topRatedMovies : topRatedTv, [topRatedTab, topRatedMovies, topRatedTv])

  const handleRemoveContinue = (event, entryKey) => {
    event.preventDefault()
    event.stopPropagation()
    localStorage.removeItem(entryKey)
    setContinueEntries((prev) => prev.filter((item) => item.key !== entryKey))
  }

  const handleContinueClick = (entry) => {
    dispatch(setPlayerConfig({
      mediaType: entry.type === 'movie' ? 'movie' : 'tv',
      tmdbId: entry.id,
      title: entry.title,
      season: entry.season || 1,
      episode: entry.episode || 1,
      posterPath: entry.poster_path
    }))
  }

  const handlePlay = (movie) => {
    dispatch(setPlayerConfig({
      mediaType: movie.media_type || (movie.first_air_date ? 'tv' : 'movie'),
      tmdbId: movie.id,
      title: movie.title || movie.name,
      season: 1,
      episode: 1,
      posterPath: movie.poster_path
    }))
  }

  return (
    <div className='home'>
      <HeroSwiper movies={featuredMovies} genres={genres} onPlay={handlePlay} />

      {continueEntries.length > 0 && (
        <SwiperSection title="Continue Watching" slidesPerView="auto" spaceBetween={20}>
          {continueEntries.map((entry) => {
            const progress = Math.min(100, Math.max(0, ((entry.time || 0) / (entry.duration || 1)) * 100))
            const posterUrl = entry.poster_path ? `${API_IMG}/${entry.poster_path}` : ''

            return (
              <div
                key={entry.key}
                className='continue-card'
                onClick={() => handleContinueClick(entry)}
              >
                <div
                  className='continue-card__media'
                  style={{ backgroundImage: posterUrl ? `url(${posterUrl})` : undefined }}
                >
                  {!posterUrl && (
                    <div className="continue-card__placeholder">
                      <span>{entry.title?.charAt(0) || '?'}</span>
                    </div>
                  )}
                  <button
                    type='button'
                    className='continue-card__remove'
                    aria-label='Devam kaydını sil'
                    onClick={(event) => handleRemoveContinue(event, entry.key)}
                  >
                    ×
                  </button>
                  <div className='continue-card__progress'>
                    <div className='continue-card__progress-bar' style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <p title={entry.title}>{entry.title || 'Adsız İçerik'}</p>
              </div>
            )
          })}
        </SwiperSection>
      )}


      <SwiperSection titleBig="TOP 10" titleSmall="CONTENT TODAY" slidesPerView="auto" spaceBetween={16}>
        {topTen.map((movie, index) => (
          <TopRankCard
            key={movie.id}
            movie={movie}
            index={index}
            genre={getGenreName(movie.genre_ids)}
          />
        ))}
      </SwiperSection>

      <SwiperSection title="Bu Haftanın Trend Olanları" slidesPerView="auto" spaceBetween={16}>
        {trendingNow.map((movie) => (
          <MovieCard key={movie.id} movie={{ ...movie, media_type: movie.media_type || 'movie' }} />
        ))}
      </SwiperSection>

      <SwiperSection
        title="En Yüksek Puanlılar"
        slidesPerView="auto"
        spaceBetween={16}
        headerRight={
          <Tabs
            value={topRatedTab}
            onChange={setTopRatedTab}
            tabs={[
              { value: 'movies', label: 'Filmler' },
              { value: 'tv', label: 'Diziler' },
            ]}
          />
        }
      >
        {topRatedList.length > 0 ? (
          topRatedList.slice(0, 20).map((item) => (
            <MovieCard key={item.id} movie={{ ...item, media_type: topRatedTab === 'movies' ? 'movie' : 'tv' }} />
          ))
        ) : (
          <div className='state'>
            <Loading />
          </div>
        )}
      </SwiperSection>

      <WatchProviders />

      <Genres setSelectedGenre={setSelectedGenre} />

      {selectedGenre && (
        <SwiperSection title={selectedGenre.name} slidesPerView="auto" spaceBetween={16}>
          {isFetching ? (
            <div className='state'>
              <Loading />
            </div>
          ) : (
            movieList.slice(0, 20).map((movie) => (
              <MovieCard key={movie.id} movie={{ ...movie, media_type: 'movie' }} />
            ))
          )}
        </SwiperSection>
      )}
    </div>
  )
}

export default Home
