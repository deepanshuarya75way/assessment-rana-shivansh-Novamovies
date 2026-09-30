import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Providecontext from './components/context/Providecontext.jsx'

createRoot(document.getElementById('root')).render(

 <Providecontext>
   <BrowserRouter>
  
    <App />

  </BrowserRouter>
 </Providecontext>
 
)
