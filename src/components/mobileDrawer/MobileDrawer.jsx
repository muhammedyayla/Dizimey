import React from 'react'
import { Link } from 'react-router-dom'
import { MdClose, MdHistory, MdFavorite, MdCelebration } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { closeMenu } from '../../redux/slices/uiSlice'
import { MY_LIST } from '../../constants/path'
import './MobileDrawer.css'

const MobileDrawer = () => {
  const dispatch = useDispatch()
  const { isMenuOpen } = useSelector((state) => state.ui)

  if (!isMenuOpen) return null

  return (
    <div className="mobile-drawer">
      <div 
        className="mobile-drawer__backdrop" 
        onClick={() => dispatch(closeMenu())} 
      />
      <div className="mobile-drawer__content">
        <button 
          className="mobile-drawer__close" 
          onClick={() => dispatch(closeMenu())}
        >
          <MdClose />
        </button>

        <div className="mobile-drawer__section">
          <h3>PERSONAL</h3>
          <div className="mobile-drawer__list">
            <Link 
              to="/history" 
              className="mobile-drawer__item" 
              onClick={() => dispatch(closeMenu())}
            >
              <MdHistory />
              <span>History</span>
            </Link>
            
            <Link 
              to={MY_LIST} 
              className="mobile-drawer__item" 
              onClick={() => dispatch(closeMenu())}
            >
              <MdFavorite />
              <span>Watchlist</span>
            </Link>
            
            <div className="mobile-drawer__item is-disabled">
              <MdCelebration />
              <span>Watch Party</span>
              <span className="mobile-drawer__badge">Yakında</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileDrawer
