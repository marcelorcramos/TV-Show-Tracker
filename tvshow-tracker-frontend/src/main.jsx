import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // ← Esta linha é importante!
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)