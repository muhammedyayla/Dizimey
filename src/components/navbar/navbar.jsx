import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openSearch, openAuth } from '../../redux/slices/uiSlice'

import './navbar.css'
import { HOME, MY_LIST } from '../../constants/path'
import { Link, useNavigate } from 'react-router-dom'
import { MdSearch } from 'react-icons/md'
import UserMenu from '../userMenu/UserMenu'
import axios from 'axios'
// Modals moved to App.jsx




const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const Navbar = () => {
  const { movies } = useSelector((store) => store.favorite)
  const dispatch = useDispatch()
  const [user, setUser] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const navigate = useNavigate()


  // Check if user is logged in and fetch user info
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (token && storedUser) {
        try {
          const res = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.data.success) {
            setUser(res.data.user)
            localStorage.setItem('user', JSON.stringify(res.data.user))
          } else {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
          }
        } catch (error) {
          console.error('Auth check error:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }
      }

      setCheckingAuth(false)
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    window.location.reload()
  }

  return (
    <header className='top-nav'>
      <div className='top-nav__brand'>
        <div className='top-nav__logo'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.89 10.21c-1.31-.66-2.18.26-3.28 1.09a4 4 0 0 0-1.32-1.57A5 5 0 1 0 10 9H8.44a4 4 0 1 0-6.06 1C.57 11.58 1 13.08 1 19a4 4 0 0 0 4 4h10a4 4 0 0 0 3.61-2.3l1.19.9A2 2 0 0 0 23 20v-8a2 2 0 0 0-1.11-1.79zM11 6a3 3 0 1 1 3 3 3 3 0 0 1-3-3zM3 7a2 2 0 1 1 2 2 2 2 0 0 1-2-2zm12 14H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2zm6-1-2-1.5v-5l2-1.5z" data-name="Camera roll" />
          </svg>
        </div>
        <Link to={HOME} className='top-nav__title'>Dizimey</Link>
      </div>

      <div className='top-nav__actions'>
        {/* Search Modal Trigger */}
        <button
          className='top-nav__search-btn'
          onClick={() => dispatch(openSearch())}
          aria-label='Search'
        >
          <MdSearch />
        </button>


        {user ? (
          <UserMenu user={user} onLogout={handleLogout} />
        ) : (
          <button
            className='top-nav__avatar'
            type='button'
            onClick={() => dispatch(openAuth())}
            aria-label='Kullanıcı profili'
          />

        )}
      </div>

      {/* Modals moved to App.jsx */}

    </header>
  )
}

export default Navbar
