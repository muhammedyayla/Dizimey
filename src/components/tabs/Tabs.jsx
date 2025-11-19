import React from 'react'
import './Tabs.css'

const Tabs = ({ value, onChange, tabs }) => {
  return (
    <div className='custom-tabs'>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`custom-tabs__tab ${value === tab.value ? 'active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default Tabs

