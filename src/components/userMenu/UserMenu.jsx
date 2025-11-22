import React, { useState, useEffect, useRef } from 'react'
import './UserMenu.css'
import { MdAccountCircle, MdEdit, MdLogout, MdSettings } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    sessionStorage.clear()
    if (onLogout) {
      onLogout()
    }
    window.location.href = '/'
  }

  if (!user) return null

  return (
    <div className='user-menu' ref={menuRef}>
      <button
        className='user-menu__trigger'
        onClick={() => setIsOpen(!isOpen)}
        aria-label='Kullanıcı menüsü'
      >
        {user.photo ? (
          <img src={user.photo} alt={user.username} className='user-menu__avatar' />
        ) : (
          <div className='user-menu__avatar-placeholder'>
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <span className='user-menu__username'>{user.username}</span>
      </button>

      {isOpen && (
        <div className='user-menu__dropdown'>
          <div className='user-menu__header'>
            {user.photo ? (
              <img src={user.photo} alt={user.username} className='user-menu__header-avatar' />
            ) : (
              <div className='user-menu__header-avatar-placeholder'>
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className='user-menu__header-info'>
              <p className='user-menu__header-username'>{user.username}</p>
              {user.email && <p className='user-menu__header-email'>{user.email}</p>}
            </div>
          </div>

          <div className='user-menu__divider' />

          <button className='user-menu__item' onClick={() => setIsOpen(false)}>
            <MdAccountCircle />
            <span>Profil</span>
          </button>

          <button className='user-menu__item' onClick={() => setIsOpen(false)}>
            <MdEdit />
            <span>Profili Düzenle</span>
          </button>

          <button className='user-menu__item' onClick={() => setIsOpen(false)}>
            <MdSettings />
            <span>Ayarlar</span>
          </button>

          <div className='user-menu__divider' />

          <button className='user-menu__item user-menu__item--danger' onClick={handleLogout}>
            <MdLogout />
            <span>Çıkış Yap</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu

