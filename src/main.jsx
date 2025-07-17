import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Ocr from './Ocr.jsx'
import FacialRecognition from './FacialRecognition.jsx'
import Registration from './components/Registration.jsx'
import Login from './components/Login.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import Dashboard from './components/Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Dashboard/> */}
    {/* <AdminDashboard/> */}
    <App/>
    {/* {<Login/>} */}
    {/* <Registration /> */}
    {/* <Ocr/> */}
    {/* <FacialRecognition/> */}
  </StrictMode>,
)
