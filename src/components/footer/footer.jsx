import React from 'react'
import './footer.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer__content'>
        <p className='footer__text'>
          <strong>Dizimey</strong> This site does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
        </p>
        <a href='mailto:contact@dizimey.com' className='footer__link'>
          contact@dizimey.com
        </a>
      </div>
    </footer>
  )
}

export default Footer

