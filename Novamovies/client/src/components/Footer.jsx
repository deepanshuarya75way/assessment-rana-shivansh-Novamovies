import React from 'react'
import { FaCirclePlay } from 'react-icons/fa6'

const Footer = () => {
  return (
    <footer className='border-t border-white/10 bg-zinc-950 px-6 py-10 text-zinc-400 sm:px-8 lg:px-20'>
      <div className='grid gap-8 md:grid-cols-[1.2fr_1fr]'>
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <FaCirclePlay className='text-4xl text-red-500' />
            <h2 className='text-3xl font-black tracking-wide text-white'>NOVAMOVIES</h2>
          </div>
          <p className='max-w-2xl text-sm leading-6'>
            Stream movies and series with a cleaner, faster browsing experience built around posters, episodes, and playback.
          </p>
        </div>

        <div className='space-y-3'>
          <h3 className='font-bold text-white'>Browse</h3>
          <div className='flex flex-wrap gap-2'>
            {['Movies', 'TV Series', 'Trending', 'Coming Soon'].map((item) => (
              <span key={item} className='rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm'>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
