import React, { useEffect, useMemo, useState } from 'react'
import './Home.css'
import Genres from '../../components/genres/genres'
import MovieCard from '../../components/movieCard/movieCard'
import SwiperSection from '../../components/swiperSection/SwiperSection'
import HeroSwiper from '../../components/heroSwiper/HeroSwiper'
import { useDispatch, useSelector } from 'react-redux'
import { getMovieList, getMovieListByGenre, getTopRatedMovies } from '../../redux/slices/movieListSlice'
import { API_IMG } from '../../constants/api'
import Loading from '../../components/Loading/Loading'
import { Link } from 'react-router-dom'

const getEnglishTitle = (item) =>
  item?.original_title || item?.original_name || item?.title || item?.name || ''

const Home = () => {
  const dispatch = useDispatch()
  const { movieList, topRatedMovies } = useSelector((store) => store.movieList)
  const { genres } = useSelector((store) => store.genre)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [isFetching, setIsFetching] = useState(false)

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
  }, [dispatch])

  const featuredMovies = useMemo(() => movieList.slice(0, 10), [movieList])
  const topTen = useMemo(() => movieList.slice(0, 10), [movieList])
  const trendingNow = useMemo(() => movieList.slice(10, 16), [movieList])

  return (
    <div className='home'>
      <HeroSwiper movies={featuredMovies} genres={genres} />

      <SwiperSection title="Bugünün Top 10 Türkiye'de" slidesPerView="auto" spaceBetween={16}>
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

      <SwiperSection title="Bugün Trend Olanlar" slidesPerView="auto" spaceBetween={16}>
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

      <SwiperSection title="Top Rated Movies" slidesPerView="auto" spaceBetween={16}>
        {topRatedMovies.length > 0 ? (
          topRatedMovies.slice(0, 20).map((movie) => (
            <MovieCard key={movie.id} movie={{ ...movie, media_type: 'movie' }} />
          ))
        ) : (
          <div className='state'>
            <Loading />
          </div>
        )}
      </SwiperSection>

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
