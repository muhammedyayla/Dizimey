import React, { useEffect, useState } from 'react'
import './genres.css'
import Tabs from '../tabs/Tabs'
import { getGenres } from '../../redux/slices/genreSlice'
import { useDispatch, useSelector } from 'react-redux'

const Genres = ({ setSelectedGenre}) => {
  const dispatch = useDispatch()
  
  const { genres } = useSelector((store) => store.genre)  // genres: state[]
  // dispatch(getGenres()) çalıştığında genres state'i güncellenir.

  useEffect(() => {
    dispatch(getGenres())
  }, [])
  
  const [activeGenre, setActiveGenre] = useState(null)

  const handleGenre = (genreId) => {
    const genre = genres.find(g => g.id === genreId)
    if (genre) {
      setSelectedGenre(genre)
      setActiveGenre(genre.id)
    }
  }

  // İlk genre'yi otomatik seç
  useEffect(() => {
    if (genres.length > 0 && !activeGenre) {
      const filteredGenres = genres.filter((genre) => genre.id !== 10749 && genre.id !== 18)
      if (filteredGenres.length > 0) {
        const firstGenre = filteredGenres[0]
        setActiveGenre(firstGenre.id)
        setSelectedGenre(firstGenre)
      }
    }
  }, [genres, activeGenre, setSelectedGenre])

  let filteredGenres = genres.filter((genre) => {
    return genre.id !== 10749 && genre.id !== 18;
  })

  const tabs = filteredGenres.map(genre => ({
    value: genre.id,
    label: genre.name
  }))

  return (
    <div className='genres'>
      <Tabs
        value={activeGenre}
        onChange={handleGenre}
        tabs={tabs}
      />
    </div>
  )
}

export default Genres