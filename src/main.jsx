import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Ocr from './Ocr.jsx'
import FacialRecognition from './FacialRecognition.jsx'
import Registration from './assets/components/Registration.jsx'
import Login from './assets/components/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
    {/* {<Login/>} */}
    {/* <Registration /> */}
    {/* <Ocr/> */}
    {/* <FacialRecognition/> */}
  </StrictMode>,
)
