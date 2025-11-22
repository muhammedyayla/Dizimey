import React, { useState, useEffect } from 'react'
import './navbar.css'
import { HOME, MY_LIST, SEARCH } from '../../constants/path'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchWatchlist } from '../../redux/slices/watchlistSlice'
import { MdSearch } from 'react-icons/md'
import AuthModal from '../authModal/AuthModal'
import UserMenu from '../userMenu/UserMenu'
import axios from 'axios'

const navLinks = [
  { label: 'Ana Sayfa', to: HOME },
  { label: 'İzleme Listem', to: MY_LIST, hasBadge: true },
]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const Navbar = () => {
  const dispatch = useDispatch()
  const watchlist = useSelector((store) => store.watchlist?.items || [])
  const token = localStorage.getItem('token')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
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
          // Verify token and get fresh user data
          const res = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.data.success) {
            setUser(res.data.user)
            localStorage.setItem('user', JSON.stringify(res.data.user))
          } else {
            // Token invalid, clear storage
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

      // Check if user needs to complete signup
      const oauthSessionId = sessionStorage.getItem('oauth_sessionId')
      if (oauthSessionId && !user) {
        setIsAuthModalOpen(true)
      }

      setCheckingAuth(false)
    }

    checkAuth()
  }, [])

  // Fetch watchlist when user logs in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && user) {
      dispatch(fetchWatchlist())
    }
  }, [user, dispatch])

  const handleLogout = () => {
    setUser(null)
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const trimmed = searchTerm.trim()
    if (!trimmed) return
    const params = new URLSearchParams({ q: trimmed, page: '1' })
    navigate(`${SEARCH}?${params.toString()}`)
    setSearchTerm('')
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
      <nav className='top-nav__links'>
        {navLinks.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`top-nav__link ${item.disabled ? 'is-disabled' : ''}`}
          >
            <span>{item.label}</span>
            {item.hasBadge && watchlist.length > 0 && (
              <span className='top-nav__badge'>{watchlist.length}</span>
            )}
          </Link>
        ))}
      </nav>
      <div className='top-nav__actions'>
        <form className='top-nav__search' onSubmit={handleSearch}>
          <MdSearch aria-hidden="true" />
          <input
            type="search"
            placeholder='Ara...'
            aria-label='Site içi arama'
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>
        {user ? (
          <UserMenu user={user} onLogout={handleLogout} />
        ) : (
          <button
            className='top-nav__avatar'
            type='button'
            onClick={() => setIsAuthModalOpen(true)}
            aria-label='Kullanıcı profili'
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVw_hT6dP2uQzNvRC1iuCpkV6vqszaZkgWJm8e5O8R5jz4gQUmnd1SGtp1UZ4kbsYJJWySCJn3lyhRVX3dKJ-UbvsxHieiazRuCjN1u3btHJL0Zq8St6EAIX_Of77qJkOKij0_xtDQ_SURgiFVF6isUJmYs53mooKIJWrYzqvZq8hPMeSDaJUEShBe-3rIGC0QyOtoK2EERX9kZKtNSp3qEAMZa5raQPFWEHvf8P7TY0iv4orth_IeMjjZQ4apa8b6S6Er6B2pZ7g")`,
            }}
          />
        )}
      </div>
      <AuthModal 
        open={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false)
          // Clear OAuth session if modal closed without completing
          sessionStorage.removeItem('oauth_token')
          sessionStorage.removeItem('oauth_sessionId')
        }}
      />
    </header>
  )
}

export default Navbar