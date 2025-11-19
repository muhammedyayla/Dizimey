import React from 'react'
import './footer.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer__content'>
        <p className='footer__text'>
          <strong>Dizimey</strong> Bu site herhangi bir dosyayı sunucumuzda saklamaz, sadece 3. taraf hizmetlerinde barındırılan medyayı bağlar.
        </p>
        <a href='mailto:contact@dizimey.com' className='footer__link'>
          contact@dizimey.com
        </a>
      </div>
    </footer>
  )
}

export default Footer

