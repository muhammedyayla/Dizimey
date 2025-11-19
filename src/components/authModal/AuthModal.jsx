import React, { useState } from 'react'
import './AuthModal.css'
import { MdClose, MdEmail, MdLock, MdPerson } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const AuthModal = ({ open, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const res = await axios.post(`${API_BASE_URL}/auth/login`, {
          username: formData.username,
          password: formData.password
        })
        if (res.data.success) {
          localStorage.setItem('user', JSON.stringify(res.data.user))
          onClose()
          window.location.reload()
        }
      } else {
        // Signup
        const res = await axios.post(`${API_BASE_URL}/auth/signup`, {
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
        if (res.data.success) {
          localStorage.setItem('user', JSON.stringify(res.data.user))
          onClose()
          window.location.reload()
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = (provider) => {
    // OAuth implementation
    window.location.href = `${API_BASE_URL}/auth/${provider}`
  }

  if (!open) return null

  return (
    <div className='auth-modal'>
      <div className='auth-modal__backdrop' onClick={onClose} />
      <div className='auth-modal__content'>
        <button className='auth-modal__close' onClick={onClose} aria-label='Kapat'>
          <MdClose />
        </button>

        <div className='auth-modal__header'>
          <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
          <p>{isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}</p>
        </div>

        <form className='auth-modal__form' onSubmit={handleSubmit}>
          <div className='auth-modal__field'>
            <MdPerson className='auth-modal__icon' />
            <input
              type='text'
              name='username'
              placeholder='Kullanıcı Adı'
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className='auth-modal__field'>
              <MdEmail className='auth-modal__icon' />
              <input
                type='email'
                name='email'
                placeholder='E-posta'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className='auth-modal__field'>
            <MdLock className='auth-modal__icon' />
            <input
              type='password'
              name='password'
              placeholder='Şifre'
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {error && <div className='auth-modal__error'>{error}</div>}

          <button type='submit' className='auth-modal__submit' disabled={loading}>
            {loading ? 'Yükleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div className='auth-modal__divider'>
          <span>veya</span>
        </div>

        <button
          type='button'
          className='auth-modal__oauth'
          onClick={() => handleOAuth('google')}
        >
          <FcGoogle />
          <span>Google ile {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</span>
        </button>

        <div className='auth-modal__footer'>
          <button
            type='button'
            className='auth-modal__toggle'
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setFormData({ username: '', email: '', password: '' })
            }}
          >
            {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal

