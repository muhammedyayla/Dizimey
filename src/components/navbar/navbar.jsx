import React, { useState } from 'react'
import './navbar.css'
import { HOME, MY_LIST, SEARCH } from '../../constants/path'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { MdNotificationsNone, MdSearch } from 'react-icons/md'

const navLinks = [
  { label: 'Ana Sayfa', to: HOME },
  { label: 'İzleme Listem', to: MY_LIST, hasBadge: true },
]

const Navbar = () => {
  const { movies } = useSelector((store) => store.favorite)
  const [searchTerm, setSearchTerm] = useState('')
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
          <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" />
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
        <button className='ghost-button' aria-label='Bildirimler'>
          <MdNotificationsNone />
        </button>
        <div
          className='top-nav__avatar'
          role='img'
          aria-label='Kullanıcı profili'
          style={{
            backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCVw_hT6dP2uQzNvRC1iuCpkV6vqszaZkgWJm8e5O8R5jz4gQUmnd1SGtp1UZ4kbsYJJWySCJn3lyhRVX3dKJ-UbvsxHieiazRuCjN1u3btHJL0Zq8St6EAIX_Of77qJkOKij0_xtDQ_SURgiFVF6isUJmYs53mooKIJWrYzqvZq8hPMeSDaJUEShBe-3rIGC0QyOtoK2EERX9kZKtNSp3qEAMZa5raQPFWEHvf8P7TY0iv4orth_IeMjjZQ4apa8b6S6Er6B2pZ7g")`,
          }}
        />
      </div>
    </header>
  )
}

export default Navbar