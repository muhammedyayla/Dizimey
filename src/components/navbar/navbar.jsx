import React, { useState } from 'react'
import './navbar.css'
import { HOME, MY_LIST, SEARCH } from '../../constants/path'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdNotificationsNone, MdSearch } from 'react-icons/md'
import AuthModal from '../authModal/AuthModal'

const navLinks = [
  { label: 'Ana Sayfa', to: HOME },
  { label: 'İzleme Listem', to: MY_LIST, hasBadge: true },
]

const Navbar = () => {
  const { movies } = useSelector((store) => store.favorite)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const navigate = useNavigate()

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
            {item.hasBadge && movies.length > 0 && (
              <span className='top-nav__badge'>{movies.length}</span>
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
        <button
          className='top-nav__avatar'
          type='button'
          onClick={() => setIsAuthModalOpen(true)}
          aria-label='Kullanıcı profili'
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVw_hT6dP2uQzNvRC1iuCpkV6vqszaZkgWJm8e5O8R5jz4gQUmnd1SGtp1UZ4kbsYJJWySCJn3lyhRVX3dKJ-UbvsxHieiazRuCjN1u3btHJL0Zq8St6EAIX_Of77qJkOKij0_xtDQ_SURgiFVF6isUJmYs53mooKIJWrYzqvZq8hPMeSDaJUEShBe-3rIGC0QyOtoK2EERX9kZKtNSp3qEAMZa5raQPFWEHvf8P7TY0iv4orth_IeMjjZQ4apa8b6S6Er6B2pZ7g")`,
          }}
        />
      </div>
      <AuthModal open={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  )
}

export default Navbar