import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MovieCard from '../../components/movieCard/movieCard'
import Loading from '../../components/Loading/Loading'
import './MyList.css'
import ReactPaginate from 'react-paginate'
import { GrPrevious, GrNext } from "react-icons/gr"
import { fetchWatchlist } from '../../redux/slices/watchlistSlice'

const MyList = () => {
  const dispatch = useDispatch()
  const { items: watchlist, loading } = useSelector((store) => store.watchlist)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      dispatch(fetchWatchlist())
    }
  }, [dispatch, token])

  if (!token) {
    return (
      <div className='my-list'>
        <h1>Lütfen giriş yapın</h1>
        <p>İzleme listenizi görmek için giriş yapmalısınız.</p>
      </div>
    )
  }


  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 10
  const endOffset = itemOffset + itemsPerPage
  const currentItems = watchlist.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(watchlist.length / itemsPerPage)

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % watchlist.length
    setItemOffset(newOffset)
  }

  if (loading) {
    return (
      <div className='my-list'>
        <Loading />
      </div>
    )
  }

  if (watchlist.length === 0) {
    return (
      <div className='my-list'>
        <h1>İzleme Listeniz</h1>
        <p>Listeniz boş. Beğendiğiniz film ve dizileri listeye ekleyin.</p>
      </div>
    )
  }

  return (
    <div className='my-list'>
      <h1>İzleme Listeniz</h1>
      <ul>
        {currentItems && currentItems.map((item, index) => (
          <MovieCard 
            key={`${item.tmdb_id}-${item.media_type}-${index}`} 
            movie={{
              id: item.tmdb_id,
              title: item.title,
              poster_path: item.poster_path,
              vote_average: item.vote_average,
              media_type: item.media_type
            }} 
          />
        ))}
      </ul>
      {pageCount > 1 && (
        <div className='pagination-component'>
          <ReactPaginate
            className='pagination'
            breakLabel="..."
            nextLabel={<GrNext />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={10}
            pageCount={pageCount}
            previousLabel={<GrPrevious />}
            renderOnZeroPageCount={null}
          />
        </div>
      )}
    </div>
  )
}

export default MyList