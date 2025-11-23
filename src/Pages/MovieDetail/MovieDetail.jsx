import React, { useEffect, useMemo, useState } from 'react'
import './MovieDetail.css'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMovieById } from '../../redux/slices/movieDetailSlice'
import { API_IMG, API_MOVIE_VIDEOS_URL, API_MOVIE_IMAGES_URL, API_KEY } from '../../constants/api'
import { addToFavorite, removeFromFavorite } from '../../redux/slices/favoritesSlice'
import { MdPlayArrow, MdAdd, MdCheck } from 'react-icons/md'
import PlayerModal from '../../components/player/PlayerModal'
import axios from 'axios'

const MovieDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { movieDetail } = useSelector((store) => store.movieDetail)
  const { movies } = useSelector((store) => store.favorite)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [trailerKey, setTrailerKey] = useState(null)
  const [logoPath, setLogoPath] = useState(null)

  useEffect(() => {
    dispatch(getMovieById(id))
  }, [dispatch, id])

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!id) return
      try {
        const res = await axios.get(`${API_MOVIE_VIDEOS_URL}/${id}/videos?api_key=${API_KEY}&language=en-US`)
        const trailer = res.data.results?.find((video) => video.type === 'Trailer' && video.site === 'YouTube')
        if (trailer?.key) {
          setTrailerKey(trailer.key)
        }
      } catch (error) {
        console.error('Trailer yüklenirken hata:', error)
      }
    }
    fetchTrailer()
  }, [id])

  useEffect(() => {
    const fetchLogo = async () => {
      if (!id) return
      try {
        const res = await axios.get(`${API_MOVIE_IMAGES_URL}/${id}/images?api_key=${API_KEY}`)
        const logo = res.data.logos?.find((logo) => logo.iso_639_1 === 'en') || res.data.logos?.[0]
        if (logo?.file_path) {
          setLogoPath(logo.file_path)
        }
      } catch (error) {
        console.error('Logo yüklenirken hata:', error)
      }
    }
    fetchLogo()
  }, [id])

  useEffect(() => {
    const exists = movies?.some((movie) => String(movie.id) === String(id))
    setIsFavorite(Boolean(exists))
  }, [movies, id])

  const releaseYear = movieDetail?.release_date
    ? new Date(movieDetail.release_date).getFullYear()
    : movieDetail?.first_air_date
      ? new Date(movieDetail.first_air_date).getFullYear()
      : null
  const runtime = movieDetail?.runtime
    ? `${Math.floor(movieDetail.runtime / 60)} sa ${movieDetail.runtime % 60} dk`
    : null

  const director = movieDetail?.credits?.crew?.find((person) => person.job === 'Director')
  const writer = movieDetail?.credits?.crew?.find((person) =>
    ['Writer', 'Screenplay', 'Story'].includes(person.job)
  )
  const cast = movieDetail?.credits?.cast?.slice(0, 6) || []
  const similar = movieDetail?.similar?.results?.slice(0, 6) || []

  const mediaType = 'movie'
  const displayTitle =
    movieDetail?.title ||
    movieDetail?.original_title ||
    'Yükleniyor...'

  const handleFavorite = () => {
    if (!movieDetail) return

    if (isFavorite) {
      dispatch(removeFromFavorite({ id }))
    } else {
      dispatch(
        addToFavorite({
          id: movieDetail.id,
          title: movieDetail.title,
          vote_average: movieDetail.vote_average,
          poster_path: movieDetail.poster_path,
        })
      )
    }
  }

  const detailMeta = useMemo(() => {
    const list = []
    if (movieDetail?.genres?.length) {
      list.push(movieDetail.genres.map((genre) => genre.name).join(', '))
    }
    if (releaseYear) list.push(releaseYear)
    if (movieDetail?.adult !== undefined) list.push(movieDetail.adult ? '18+' : '13+')
    if (runtime) list.push(runtime)
    return list
  }, [movieDetail, releaseYear, runtime])

  const rating = movieDetail?.vote_average ? movieDetail.vote_average.toFixed(1) : null

  const heroImage = movieDetail?.backdrop_path || movieDetail?.poster_path

  return (
    <div className='detail-page'>
      <section className='detail-hero'>
        {trailerKey ? (
          <div className='detail-hero__video'>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
              frameBorder='0'
              allow='autoplay; encrypted-media'
              allowFullScreen
              className='detail-hero__video-iframe'
            />
          </div>
        ) : (
          <div
            className='detail-hero__background'
            style={{ backgroundImage: heroImage ? `url(${API_IMG}/${heroImage})` : undefined }}
          />
        )}
        <div className='detail-hero__overlay' />
        <div className='detail-hero__content'>
          <p className='eyebrow'>Film Detayı</p>
          {logoPath ? (
            <img src={`${API_IMG}/${logoPath}`} alt={displayTitle} className='detail-hero__logo' />
          ) : (
            <h1>{displayTitle}</h1>
          )}
          <p className='detail-hero__description'>{movieDetail?.overview}</p>
          {detailMeta.length > 0 && (
            <div className='detail-hero__meta'>
              {detailMeta.map((item, index) => (
                <React.Fragment key={item}>
                  <span>{item}</span>
                  {index < detailMeta.length - 1 && <span className='dot' />}
                </React.Fragment>
              ))}
            </div>
          )}
          <div className='detail-hero__actions'>
            <button className='button button--primary' type='button' onClick={() => setIsPlayerOpen(true)}>
              <MdPlayArrow aria-hidden='true' />
              Oynat
            </button>
            <button className='button button--secondary' onClick={handleFavorite}>
              {isFavorite ? <MdCheck aria-hidden='true' /> : <MdAdd aria-hidden='true' />}
              {isFavorite ? 'Listemde' : 'Listeme Ekle'}
            </button>
          </div>
        </div>
      </section>

      <section className='detail-content'>
        <div className='tabs'>
          <button className='tabs__item is-active'>Genel Bakış</button>
          <button className='tabs__item'>Oyuncular</button>
          <button className='tabs__item'>Benzer İçerikler</button>
        </div>

        <div className='detail-body'>
          <div className='detail-body__main'>
            <h3>Konu Özeti</h3>
            <p className='detail-body__text'>{movieDetail?.overview}</p>

            <div className='detail-body__section'>
              <h3>Oyuncu Kadrosu</h3>
              <div className='cast-grid'>
                {cast.length ? (
                  cast.map((person) => (
                    <div key={person.cast_id || person.id} className='cast-card'>
                      <div
                        className='cast-card__avatar'
                        style={{
                          backgroundImage: person.profile_path
                            ? `url(${API_IMG}/${person.profile_path})`
                            : undefined,
                        }}
                      />
                      <p className='cast-card__name'>{person.name}</p>
                      <p className='cast-card__role'>{person.character}</p>
                    </div>
                  ))
                ) : (
                  <p className='detail-body__text'>Oyuncu bilgisi bulunamadı.</p>
                )}
              </div>
            </div>
          </div>

          <aside className='detail-body__side'>
            <div>
              <h4>Yönetmen</h4>
              <p>{director?.name || 'Bilinmiyor'}</p>
            </div>
            <div>
              <h4>Senarist</h4>
              <p>{writer?.name || 'Bilinmiyor'}</p>
            </div>
            <div>
              <h4>Diller</h4>
              <p>{movieDetail?.spoken_languages?.map((lang) => lang.english_name).join(', ') || '—'}</p>
            </div>
            <div>
              <h4>Puan</h4>
              <p className='rating-pill'>{rating ? `${rating} / 10` : '—'}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className='detail-recommendations'>
        <h3>Benzer İçerikler</h3>
        <div className='recommendations-grid'>
          {similar.length ? (
            similar.map((item) => {
              const itemPath = item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`
              const itemTitle = item.title || item.name || item.original_title || item.original_name
              return (
                <Link key={item.id} to={itemPath} className='recommend-card'>
                  <div
                    className='recommend-card__media'
                    style={{
                      backgroundImage: `url(${API_IMG}/${item.poster_path || item.backdrop_path})`,
                    }}
                  />
                  <p>{itemTitle}</p>
                </Link>
              )
            })
          ) : (
            <p className='detail-body__text'>Benzer içerik bulunamadı.</p>
          )}
        </div>
      </section>
      <PlayerModal
        open={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        mediaType={mediaType}
        tmdbId={movieDetail?.id}
        title={displayTitle}
      />
    </div>
  )
}

export default MovieDetail

