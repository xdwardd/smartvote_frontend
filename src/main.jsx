import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Ocr from './Ocr.jsx'
import FacialRecognition from './FacialRecognition.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Ocr/> */}
    {/* <FacialRecognition/> */}
  </StrictMode>,
)
