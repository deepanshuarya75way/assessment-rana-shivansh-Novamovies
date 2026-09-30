import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar  from './components/Navbar'
import MainContent from './components/Home'
import Sidebar from './components/Sidebar'
import Tvseries from './components/Tvseries'
import Tvpop from './components/Tvpop'
import Footer from './components/Footer'
import MoviePlayer from './components/MoviePlayer'
import TvPlayer from './components/TvPlayer'
import NewPopular from './components/NewPopular'

const   movie  = () => {
  
   
  return (
    <>
     <Navbar/>
     <Sidebar />
    
  <Routes>
    <Route path='/' element={<MainContent/>}/>
    <Route path='/play/movie/:movieId' element={<MoviePlayer/>} />
    <Route path='/play/tv/:tvId/:season/:episode' element={<TvPlayer/>} />
    <Route path='/tvseries' element={<Tvseries/>}/>
    <Route path='/tvdetail' element={<Tvpop/>} />
    <Route path='/new-popular' element={<NewPopular/>} />
  </Routes>

  <Footer/>
    </>
   
  )
}

export default   movie 
