import './App.css'
import './css/reset.css'
import React from 'react'

import Navbar from './components/navbar/navbar'
import Footer from './components/footer/footer'
import Home from './Pages/Home/Home'
import MyList from './Pages/MyList/MyList'
import MovieDetail from './Pages/MovieDetail/MovieDetail'
import SeriesDetail from './Pages/SeriesDetail/SeriesDetail'
import Search from './Pages/Search/Search'

import { Route, Routes } from 'react-router-dom'
import { HOME, MY_LIST, MOVIE_DETAIL, TV_DETAIL, SEARCH } from './constants/path'

function App() {
  return (
      <div className='app'>
          <Navbar />
          <Routes>
            <Route path={HOME} element={<Home />}/>
            <Route path={MY_LIST} element={<MyList />}/>
            <Route path={MOVIE_DETAIL} element={<MovieDetail />}/>
            <Route path={TV_DETAIL} element={<SeriesDetail />}/>
            <Route path={SEARCH} element={<Search />}/>
          </Routes>
          <Footer />
      </div>
  )
}

export default App
