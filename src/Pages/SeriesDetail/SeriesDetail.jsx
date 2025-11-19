import React, { useEffect, useMemo, useState } from 'react'
import './SeriesDetail.css'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getTvById, getTvSeasonEpisodes } from '../../redux/slices/tvDetailSlice'
import { API_IMG, API_TV_FIND_URL, API_TV_VIDEOS_URL, API_TV_IMAGES_URL, API_KEY } from '../../constants/api'
import { addToFavorite, removeFromFavorite } from '../../redux/slices/favoritesSlice'
import { MdPlayArrow, MdAdd, MdCheck, MdSearch, MdDownload } from 'react-icons/md'
import PlayerModal from '../../components/player/PlayerModal'
import axios from 'axios'

const SeriesDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { tvDetail } = useSelector((store) => store.tvDetail)
  const { movies } = useSelector((store) => store.favorite)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [episodeSearch, setEpisodeSearch] = useState('')
  const [selectedEpisode, setSelectedEpisode] = useState({ season: 1, episode: 1 })
  const [seasonEpisodes, setSeasonEpisodes] = useState([])
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  const [trailerKey, setTrailerKey] = useState(null)
  const [logoPath, setLogoPath] = useState(null)

  useEffect(() => {
    dispatch(getTvById(id))
  }, [dispatch, id])

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!id) return
      try {
        const res = await axios.get(`${API_TV_VIDEOS_URL}/${id}/videos?api_key=${API_KEY}&language=en-US`)
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
        const res = await axios.get(`${API_TV_IMAGES_URL}/${id}/images?api_key=${API_KEY}`)
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

  useEffect(() => {
    if (tvDetail?.seasons?.length > 0) {
      const firstSeason = tvDetail.seasons.find((s) => s.season_number >= 0) || tvDetail.seasons[0]
      setSelectedSeason(firstSeason?.season_number || 1)
    }
  }, [tvDetail])

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!id || !selectedSeason) return
      setLoadingEpisodes(true)
      try {
        const res = await axios.get(`${API_TV_FIND_URL}/${id}/season/${selectedSeason}?api_key=${API_KEY}&language=tr-TR`)
        setSeasonEpisodes(res.data.episodes || [])
      } catch (error) {
        console.error('Bölümler yüklenirken hata:', error)
        setSeasonEpisodes([])
      } finally {
        setLoadingEpisodes(false)
      }
    }
    fetchEpisodes()
  }, [id, selectedSeason])

  const displayTitle = tvDetail?.name || tvDetail?.original_name || 'Yükleniyor...'

  const handleFavorite = () => {
    if (!tvDetail) return

    if (isFavorite) {
      dispatch(removeFromFavorite({ id }))
    } else {
      dispatch(
        addToFavorite({
          id: tvDetail.id,
          title: tvDetail.name,
          vote_average: tvDetail.vote_average,
          poster_path: tvDetail.poster_path,
        })
      )
    }
  }

  const handlePlayEpisode = (seasonNum, episodeNum) => {
    setSelectedEpisode({ season: seasonNum, episode: episodeNum })
    setIsPlayerOpen(true)
  }

  const seasons = tvDetail?.seasons || []
  
  const episodes = useMemo(() => {
    if (seasonEpisodes.length > 0) {
      return seasonEpisodes.map((ep) => ({
        season_number: selectedSeason,
        episode_number: ep.episode_number,
        name: ep.name || `Bölüm ${ep.episode_number}`,
        overview: ep.overview || '',
        still_path: ep.still_path || tvDetail?.poster_path,
      }))
    }
    return []
  }, [seasonEpisodes, selectedSeason, tvDetail])

  const filteredEpisodes = useMemo(() => {
    if (!episodeSearch.trim()) return episodes
    return episodes.filter((ep) =>
      ep.name?.toLowerCase().includes(episodeSearch.toLowerCase()) ||
      ep.overview?.toLowerCase().includes(episodeSearch.toLowerCase())
    )
  }, [episodes, episodeSearch])

  const cast = tvDetail?.credits?.cast?.slice(0, 6) || []
  const similar = tvDetail?.similar?.results?.slice(0, 6) || []

  const heroImage = tvDetail?.backdrop_path || tvDetail?.poster_path

  return (
    <div className='series-detail-page'>
      <section className='series-detail-hero'>
        {trailerKey ? (
          <div className='series-detail-hero__video'>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1`}
              frameBorder='0'
              allow='autoplay; encrypted-media'
              allowFullScreen
              className='series-detail-hero__video-iframe'
            />
          </div>
        ) : (
          <div
            className='series-detail-hero__background'
            style={{ backgroundImage: heroImage ? `url(${API_IMG}/${heroImage})` : undefined }}
          />
        )}
        <div className='series-detail-hero__overlay' />
        <div className='series-detail-hero__content'>
          <p className='eyebrow'>Dizi Detayı</p>
          {logoPath ? (
            <img src={`${API_IMG}/${logoPath}`} alt={displayTitle} className='series-detail-hero__logo' />
          ) : (
            <h1>{displayTitle}</h1>
          )}
          <p className='series-detail-hero__description'>{tvDetail?.overview}</p>
          {tvDetail?.genres && tvDetail.genres.length > 0 && (
            <div className='series-detail-hero__genres'>
              {tvDetail.genres.map((genre) => (
                <button key={genre.id} className='genre-chip'>
                  {genre.name}
                </button>
              ))}
            </div>
          )}
          <div className='series-detail-hero__actions'>
            <button
              className='button button--primary'
              type='button'
              onClick={() => {
                setSelectedEpisode({ season: 1, episode: 1 })
                setIsPlayerOpen(true)
              }}
            >
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

      <section className='series-detail-content'>
        <div className='episodes-section'>
          <h2 className='section-title'>
            <span className='section-title__bar' />
            Bölümler
          </h2>
          <div className='episodes-controls'>
            <div className='season-selector'>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className='season-select'
              >
                {seasons.map((season) => (
                  <option key={season.id} value={season.season_number}>
                    Sezon {season.season_number}
                  </option>
                ))}
              </select>
            </div>
            <div className='episode-search'>
              <MdSearch className='episode-search__icon' />
              <input
                type='text'
                placeholder='Bölüm ara...'
                value={episodeSearch}
                onChange={(e) => setEpisodeSearch(e.target.value)}
                className='episode-search__input'
              />
            </div>
          </div>
          <div className='episodes-list'>
            {filteredEpisodes.map((episode) => (
              <div key={`s${episode.season_number}e${episode.episode_number}`} className='episode-card'>
                <div className='episode-card__thumbnail'>
                  <img
                    src={episode.still_path ? `${API_IMG}/${episode.still_path}` : `${API_IMG}/${tvDetail?.poster_path}`}
                    alt={`${episode.name} thumbnail`}
                  />
                  <div className='episode-card__play-overlay'>
                    <button
                      className='episode-card__play-btn'
                      onClick={() => handlePlayEpisode(episode.season_number, episode.episode_number)}
                      aria-label={`${episode.name} oynat`}
                    >
                      <MdPlayArrow />
                    </button>
                  </div>
                </div>
                <div className='episode-card__info'>
                  <h3 className='episode-card__title'>
                    {episode.episode_number}. Bölüm: {episode.name}
                  </h3>
                  <p className='episode-card__description'>
                    {episode.overview || 'Açıklama mevcut değil.'}
                  </p>
                </div>
                <button className='episode-card__download' aria-label='İndir'>
                  <MdDownload />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className='cast-section'>
          <h2 className='section-title'>
            <span className='section-title__bar' />
            Oyuncular
          </h2>
          <div className='cast-grid'>
            {cast.length ? (
              cast.map((person) => (
                <div key={person.cast_id || person.id} className='cast-card-horizontal'>
                  <div
                    className='cast-card-horizontal__avatar'
                    style={{
                      backgroundImage: person.profile_path
                        ? `url(${API_IMG}/${person.profile_path})`
                        : undefined,
                    }}
                  />
                  <div className='cast-card-horizontal__info'>
                    <p className='cast-card-horizontal__name'>{person.name}</p>
                    <p className='cast-card-horizontal__role'>{person.character}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className='empty-state'>Oyuncu bilgisi bulunamadı.</p>
            )}
          </div>
        </div>

        <div className='recommendations-section'>
          <h2 className='section-title'>
            <span className='section-title__bar' />
            Bunları da Beğenebilirsiniz
          </h2>
          <div className='recommendations-grid'>
            {similar.length ? (
              similar.map((item) => {
                const itemPath = item.media_type === 'tv' ? `/tv/${item.id}` : `/${item.id}`
                return (
                  <Link key={item.id} to={itemPath} className='recommend-card'>
                    <div
                      className='recommend-card__media'
                      style={{
                        backgroundImage: `url(${API_IMG}/${item.poster_path || item.backdrop_path})`,
                      }}
                    />
                  </Link>
                )
              })
            ) : (
              <p className='empty-state'>Benzer içerik bulunamadı.</p>
            )}
          </div>
        </div>
      </section>

      <PlayerModal
        open={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        mediaType='tv'
        tmdbId={tvDetail?.id}
        title={displayTitle}
        season={selectedEpisode.season}
        episode={selectedEpisode.episode}
      />
    </div>
  )
}

export default SeriesDetail

