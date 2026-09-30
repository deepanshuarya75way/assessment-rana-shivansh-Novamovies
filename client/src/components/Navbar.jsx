import React, { useContext } from 'react'
import { IoReorderThreeOutline } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import Createcontext from './context/Createcontext';
import Searchmovie from './Searchmovie';
import { RxCross2 } from "react-icons/rx";

const Navbar = () => {
  const { setSearch, search,sidebardisplay, setSidebardisplay } = useContext(Createcontext)
        const handleclick= ()=>{
            setSidebardisplay(!sidebardisplay)
        }

  return (
   <>
    <div className='fixed top-0 z-50 flex h-16 w-full items-center gap-3 border-b border-white/10 bg-zinc-950/95 px-3 text-white shadow-2xl shadow-black/20 backdrop-blur sm:h-20 sm:justify-between sm:px-10 lg:px-26'>

      {/* Left Section */}
      <div className='lg:hidden'>
        {
          !sidebardisplay ? (
             <IoReorderThreeOutline
          onClick={handleclick}
          className='cursor-pointer text-4xl text-white transition duration-75 hover:text-red-500 lg:hidden'
        />

          ) :
          (
            <RxCross2
             onClick={handleclick}
          className='cursor-pointer text-3xl text-white transition duration-75 hover:text-red-500 lg:hidden'
           />

          )
        }
       
      </div>

     <div>
        <NavLink className='cursor-pointer text-xl font-extrabold tracking-wide text-red-500 sm:text-2xl'>
          Novamovies
        </NavLink>
     </div>

      {/* Center Menu */}
      <div className='hidden gap-8 font-medium text-zinc-300 lg:flex'>
        <NavLink to='/' className='transition hover:text-red-500'>Movies</NavLink>
        {/* <span className='hover:text-white cursor-pointer'>Movies</span> */}
        <NavLink to='/tvseries' className='transition hover:text-red-500'>Series</NavLink>
        <NavLink to='/new-popular' className='transition hover:text-red-500'>New & Popular</NavLink>
      </div>

      {/* Search */}
      <div className='relative hidden md:flex'>
        <input
          type="search"
          value={search}
          placeholder='Search movies...'
          onChange={(e) => setSearch(e.target.value)}
          className='w-48 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-zinc-500 transition focus:outline-none focus:ring-2 focus:ring-red-500 sm:w-64'
        />

       

        {/* Search Dropdown */}
        <Searchmovie />
      </div>

       <div className='relative flex min-w-0 flex-1 md:hidden'>
         <input type="search" placeholder='Search...' className='w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-zinc-500 shadow-2xl focus:outline-none focus:ring-2 focus:ring-red-500'  value={search}
          onChange={(e) => setSearch(e.target.value)} />

           <Searchmovie />
       </div>

    

    </div>
    </>
  )
}

export default Navbar
