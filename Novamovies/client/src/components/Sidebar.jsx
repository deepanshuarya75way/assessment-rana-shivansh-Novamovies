
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import Createcontext from './context/Createcontext'

const Sidebar = () => {
  const {sidebardisplay, setSidebardisplay} = useContext(Createcontext)

  const closeSidebar = () => setSidebardisplay(false)

  return (
    <div
      className={`fixed inset-0 z-40 lg:hidden ${sidebardisplay ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!sidebardisplay}
    >
      <button
        type="button"
        onClick={closeSidebar}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          sidebardisplay ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close menu"
      />

      <aside
        className={`absolute left-0 top-0 z-50 flex h-screen w-[82vw] max-w-80 flex-col border-r border-white/10 bg-zinc-950 px-4 pt-20 text-white shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${
          sidebardisplay ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
          <div className="mb-6 px-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">Menu</p>
            <h2 className="mt-1 text-2xl font-black">Novamovies</h2>
          </div>

          <NavLink to='/' onClick={closeSidebar} className="cursor-pointer rounded-lg px-3 py-4 text-lg font-semibold text-zinc-200 transition hover:bg-white/5 hover:text-red-500">
            Movies
          </NavLink>

          <NavLink
            to="/tvseries"
            onClick={closeSidebar}
            className="rounded-lg px-3 py-4 text-lg font-semibold text-zinc-200 transition hover:bg-white/5 hover:text-red-500"
          >
            Series
          </NavLink>

          <NavLink
            to="/new-popular"
            onClick={closeSidebar}
            className="cursor-pointer rounded-lg px-3 py-4 text-lg font-semibold text-zinc-200 transition hover:bg-white/5 hover:text-red-500"
          >
            New & Popular
          </NavLink>

          <div className="mt-auto border-t border-white/10 py-5 text-xs leading-5 text-zinc-500">
            Movies, series, trending titles and fresh releases in one place.
          </div>
      </aside>
    </div>
  )
}

export default Sidebar
