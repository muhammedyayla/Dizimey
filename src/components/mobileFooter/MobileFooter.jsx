import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MdHome, MdSearch, MdMenu } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { openSearch, openMenu } from '../../redux/slices/uiSlice'
import { HOME } from '../../constants/path'
import './MobileFooter.css'

const MobileFooter = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const isHome = location.pathname === HOME

  return (
    <footer className="mobile-footer">
      <Link to={HOME} className={`mobile-footer__item ${isHome ? 'is-active' : ''}`}>
        <MdHome />
        <span>Home</span>
      </Link>
      
      <button 
        className="mobile-footer__item" 
        onClick={() => dispatch(openSearch())}
      >
        <MdSearch />
        <span>Search</span>
      </button>
      
      <button 
        className="mobile-footer__item" 
        onClick={() => dispatch(openMenu())}
      >
        <MdMenu />
        <span>Menu</span>
      </button>
    </footer>
  )
}

export default MobileFooter
