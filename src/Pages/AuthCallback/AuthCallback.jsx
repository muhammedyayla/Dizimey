import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthModal from '../../components/authModal/AuthModal'
import Navbar from '../../components/navbar/navbar'
import Footer from '../../components/footer/footer'

const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    const token = searchParams.get('token')
    const sessionIdParam = searchParams.get('sessionId') || sessionStorage.getItem('oauth_sessionId')

    if (token) {
      // User already has token, login directly
      localStorage.setItem('token', token)
      if (sessionIdParam) {
        localStorage.setItem('sessionId', sessionIdParam)
      }
      // Get user info
      navigate('/')
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } else if (sessionIdParam) {
      // Store session info for complete signup
      setSessionId(sessionIdParam)
      sessionStorage.setItem('oauth_sessionId', sessionIdParam)
      setShowModal(true)
    } else {
      // No valid callback params, go home
      navigate('/')
    }
  }, [searchParams, navigate])

  const handleModalClose = () => {
    setShowModal(false)
    sessionStorage.removeItem('oauth_token')
    sessionStorage.removeItem('oauth_sessionId')
    navigate('/')
  }

  const handleCompleteSignup = () => {
    setShowModal(false)
    sessionStorage.removeItem('oauth_token')
    sessionStorage.removeItem('oauth_sessionId')
    navigate('/')
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  return (
    <div className='app'>
      <Navbar />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 200px)',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {showModal && <p>Kaydı tamamlamak için formu doldurun</p>}
      </div>
      <Footer />
      <AuthModal 
        open={showModal} 
        onClose={handleModalClose}
        sessionId={sessionId}
        onCompleteSignup={handleCompleteSignup}
      />
    </div>
  )
}

export default AuthCallback

