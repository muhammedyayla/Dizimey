import React, { useState, useEffect } from 'react'
import './AuthModal.css'
import { MdClose, MdLock, MdPerson } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const AuthModal = ({ open, onClose, sessionId: propSessionId = null, onCompleteSignup }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [completeSignupData, setCompleteSignupData] = useState({
    sessionId: propSessionId || null,
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  // Check if coming from OAuth callback via props or URL params
  useEffect(() => {
    if (propSessionId) {
      // Session ID passed as prop (from AuthCallback)
      setCompleteSignupData(prev => ({ ...prev, sessionId: propSessionId }))
      setIsLogin(false)
    } else {
      // Check URL params
      const token = searchParams.get('token')
      const sessionId = searchParams.get('sessionId') || sessionStorage.getItem('oauth_sessionId')
      
      if (sessionId) {
        setCompleteSignupData(prev => ({ ...prev, sessionId }))
        setIsLogin(false)
        if (token || sessionId) {
          setSearchParams({}) // Clear URL params
        }
      }
    }
  }, [propSessionId, searchParams, setSearchParams])

  const handleChange = (e) => {
    if (completeSignupData.sessionId) {
      setCompleteSignupData({
        ...completeSignupData,
        [e.target.name]: e.target.value
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (completeSignupData.sessionId) {
        // Complete signup after OAuth
        const res = await axios.post(`${API_BASE_URL}/auth/complete-signup`, {
          sessionId: completeSignupData.sessionId,
          username: completeSignupData.username,
          password: completeSignupData.password
        })
        if (res.data.success) {
          localStorage.setItem('user', JSON.stringify(res.data.user))
          localStorage.setItem('token', res.data.token)
          sessionStorage.removeItem('oauth_token')
          sessionStorage.removeItem('oauth_sessionId')
          
          // Call onCompleteSignup if provided
          if (onCompleteSignup) {
            onCompleteSignup()
          } else {
            onClose()
            window.location.href = '/'
          }
        }
      } else if (isLogin) {
        // Login
        const res = await axios.post(`${API_BASE_URL}/auth/login`, {
          username: formData.username,
          password: formData.password
        })
        if (res.data.success) {
          localStorage.setItem('user', JSON.stringify(res.data.user))
          localStorage.setItem('token', res.data.token)
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

  const handleGoogleOAuth = () => {
    // Redirect to Google OAuth
    window.location.href = `${API_BASE_URL.replace('/api', '')}/api/auth/google`
  }

  if (!open) return null

  const isCompletingSignup = completeSignupData.sessionId !== null

  return (
    <div className='auth-modal'>
      <div className='auth-modal__backdrop' onClick={onClose} />
      <div className='auth-modal__content'>
        <button className='auth-modal__close' onClick={onClose} aria-label='Kapat'>
          <MdClose />
        </button>

        {isCompletingSignup ? (
          <>
            <div className='auth-modal__header'>
              <h2>Kaydı Tamamla</h2>
              <p>Kullanıcı adı ve şifrenizi belirleyin</p>
            </div>

            <form className='auth-modal__form' onSubmit={handleSubmit}>
              <div className='auth-modal__field'>
                <MdPerson className='auth-modal__icon' />
                <input
                  type='text'
                  name='username'
                  placeholder='Kullanıcı Adı'
                  value={completeSignupData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='auth-modal__field'>
                <MdLock className='auth-modal__icon' />
                <input
                  type='password'
                  name='password'
                  placeholder='Şifre (min. 6 karakter)'
                  value={completeSignupData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              {error && <div className='auth-modal__error'>{error}</div>}

              <button type='submit' className='auth-modal__submit' disabled={loading}>
                {loading ? 'Yükleniyor...' : 'Kaydı Tamamla'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className='auth-modal__header'>
              <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
              <p>{isLogin ? 'Hesabınıza giriş yapın' : 'Google ile kayıt olun'}</p>
            </div>

            {!isLogin && (
              <div className='auth-modal__info'>
                <p>Kayıt olmak için Google hesabınızı kullanın. Ardından kullanıcı adı ve şifrenizi belirleyin.</p>
              </div>
            )}

            {isLogin && (
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

                <div className='auth-modal__field'>
                  <MdLock className='auth-modal__icon' />
                  <input
                    type='password'
                    name='password'
                    placeholder='Şifre'
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {error && <div className='auth-modal__error'>{error}</div>}

                <button type='submit' className='auth-modal__submit' disabled={loading}>
                  {loading ? 'Yükleniyor...' : 'Giriş Yap'}
                </button>
              </form>
            )}

            {!isLogin && (
              <button
                type='button'
                className='auth-modal__oauth'
                onClick={handleGoogleOAuth}
              >
                <FcGoogle />
                <span>Google ile Kayıt Ol</span>
              </button>
            )}

            {isLogin && (
              <>
                <div className='auth-modal__divider'>
                  <span>veya</span>
                </div>

                <button
                  type='button'
                  className='auth-modal__oauth'
                  onClick={handleGoogleOAuth}
                >
                  <FcGoogle />
                  <span>Google ile Giriş Yap</span>
                </button>
              </>
            )}

            <div className='auth-modal__footer'>
              <button
                type='button'
                className='auth-modal__toggle'
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setFormData({ username: '', password: '' })
                  setCompleteSignupData({ sessionId: null, username: '', password: '' })
                }}
              >
                {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthModal

