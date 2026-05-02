import './App.css'
import './css/reset.css'
import React, { useEffect } from 'react'

import Navbar from './components/navbar/navbar'
import Footer from './components/footer/footer'
import Home from './Pages/Home/Home'
import MyList from './Pages/MyList/MyList'
import MovieDetail from './Pages/MovieDetail/MovieDetail'
import SeriesDetail from './Pages/SeriesDetail/SeriesDetail'
import Search from './Pages/Search/Search'

import { Route, Routes, useLocation } from 'react-router-dom'
import { HOME, MY_LIST, MOVIE_DETAIL, TV_DETAIL, SEARCH } from './constants/path'
import { useSelector, useDispatch } from 'react-redux'
import PlayerModal from './components/player/PlayerModal'
import { closePlayer } from './redux/slices/playerSlice'
import { closeSearch, closeAuth, closeMenu } from './redux/slices/uiSlice'
import SearchModal from './components/searchModal/SearchModal'
import AuthModal from './components/authModal/AuthModal'
import MobileFooter from './components/mobileFooter/MobileFooter'
import MobileDrawer from './components/mobileDrawer/MobileDrawer'


function App() {
  const { pathname } = useLocation()
  const dispatch = useDispatch()
  const player = useSelector((state) => state.player)
  const { isSearchOpen, isAuthOpen } = useSelector((state) => state.ui)


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className='app'>
      <Navbar />
      <Routes>
        <Route path={HOME} element={<Home />} />
        <Route path={MY_LIST} element={<MyList />} />
        <Route path={MOVIE_DETAIL} element={<MovieDetail />} />
        <Route path={TV_DETAIL} element={<SeriesDetail />} />
        <Route path={SEARCH} element={<Search />} />
      </Routes>
      <Footer />
      <MobileFooter />
      <MobileDrawer />

      <SearchModal
        open={isSearchOpen}
        onClose={() => dispatch(closeSearch())}
      />

      <AuthModal
        open={isAuthOpen}
        onClose={() => dispatch(closeAuth())}
      />

      <PlayerModal
        open={player.open}
        onClose={() => dispatch(closePlayer())}
        mediaType={player.mediaType}
        tmdbId={player.tmdbId}
        title={player.title}
        season={player.season}
        episode={player.episode}
        posterPath={player.posterPath}
      />
    </div>

  )
}

export default App
