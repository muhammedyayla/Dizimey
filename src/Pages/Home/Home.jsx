import React, { useEffect, useMemo, useState } from 'react'
import './Home.css'
import Genres from '../../components/genres/genres'
import MovieCard from '../../components/movieCard/movieCard'
import SwiperSection from '../../components/swiperSection/SwiperSection'
import HeroSwiper from '../../components/heroSwiper/HeroSwiper'
import ContinueWatching from '../../components/continueWatching/ContinueWatching'
import Tabs from '../../components/tabs/Tabs'
import AuthModal from '../../components/authModal/AuthModal'
import { useDispatch, useSelector } from 'react-redux'
import { getMovieList, getMovieListByGenre, getTopRatedMovies, getTopRatedTv, getTrending } from '../../redux/slices/movieListSlice'
import { API_IMG } from '../../constants/api'
import Loading from '../../components/Loading/Loading'
import { Link, useSearchParams } from 'react-router-dom'

const getEnglishTitle = (item) =>
  item?.title || item?.name || item?.original_title || item?.original_name || ''

const Home = () => {
  const dispatch = useDispatch()
  const { movieList, topRatedMovies, topRatedTv, trending } = useSelector((store) => store.movieList)
  const { genres } = useSelector((store) => store.genre)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [topRatedTab, setTopRatedTab] = useState('movies')
  const [searchParams, setSearchParams] = useSearchParams()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  // Check if coming from OAuth callback
  useEffect(() => {
    const oauthSessionId = searchParams.get('sessionId') || sessionStorage.getItem('oauth_sessionId')
    const token = searchParams.get('token')
    
    if (oauthSessionId && !localStorage.getItem('user')) {
      setSessionId(oauthSessionId)
      setShowAuthModal(true)
      if (token) {
        sessionStorage.setItem('oauth_token', token)
      }
      sessionStorage.setItem('oauth_sessionId', oauthSessionId)
      // Clear URL params
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

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

  const featuredMovies = useMemo(() => trending.slice(0, 10), [trending])
  const topTen = useMemo(() => movieList.slice(0, 10), [movieList])
  const trendingNow = useMemo(() => movieList.slice(10, 16), [movieList])
  const topRatedList = useMemo(() => topRatedTab === 'movies' ? topRatedMovies : topRatedTv, [topRatedTab, topRatedMovies, topRatedTv])

  return (
    <div className='home'>
      <HeroSwiper movies={featuredMovies} genres={genres} />

      <ContinueWatching />

      <SwiperSection title="Türkiye'de bu haftanın Top 10 Filmleri" slidesPerView="auto" spaceBetween={16}>
        {topTen.map((movie, index) => (
          <Link key={movie.id} to={`/${movie.id}`} className='top-rank-card'>
            <span className='top-rank-card__number'>{index + 1}</span>
            <div
              className='top-rank-card__poster'
              style={{ backgroundImage: `url(${API_IMG}/${movie.poster_path})` }}
            />
          </Link>
        ))}
      </SwiperSection>

      <SwiperSection title="Bu Haftanın Trend Olanları" slidesPerView="auto" spaceBetween={16}>
        {trendingNow.map((movie) => (
          <Link key={movie.id} to={`/${movie.id}`} className='trend-card'>
            <div
              className='trend-card__media'
              style={{
                backgroundImage: `url(${API_IMG}/${movie.backdrop_path || movie.poster_path})`,
              }}
            />
          </Link>
        ))}
      </SwiperSection>

      <section className='top-rated-section'>
        <div className='top-rated-section__header'>
          <h3>En Yüksek Puanlılar</h3>
          <Tabs
            value={topRatedTab}
            onChange={setTopRatedTab}
            tabs={[
              { value: 'movies', label: 'Movies' },
              { value: 'tv', label: 'TV Series' }
            ]}
          />
        </div>
        <SwiperSection title="" slidesPerView="auto" spaceBetween={16}>
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
      </section>

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
      <AuthModal
        open={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          sessionStorage.removeItem('oauth_token')
          sessionStorage.removeItem('oauth_sessionId')
        }}
        sessionId={sessionId}
        onCompleteSignup={() => {
          setShowAuthModal(false)
          sessionStorage.removeItem('oauth_token')
          sessionStorage.removeItem('oauth_sessionId')
          window.location.reload()
        }}
      />
    </div>
  )
}

export default Home
