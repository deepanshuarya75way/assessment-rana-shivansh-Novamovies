import React, { useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'

const MoviePlayer = () => {
  const { movieId } = useParams()

  useEffect(() => {
    document.title = 'Now playing | Novamovies'
  }, [])

  return (
    <main className='min-h-screen bg-zinc-950 px-3 pb-8 pt-20 text-white sm:px-6 sm:pt-24 lg:px-24'>
      <div className='mb-4 flex items-center justify-between'>
        <NavLink
          to='/'
          className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15'
        >
          <IoArrowBack />
          Movies
        </NavLink>
        <p className='text-xs font-medium uppercase tracking-[0.28em] text-zinc-500'>Movie Player</p>
      </div>

      <section className='overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/40'>
        {movieId ? (
          <iframe
            src={`https://player.videasy.net/movie/${movieId}`}
            className='aspect-video w-full'
            title='Movie player'
            frameBorder='0'
            allowFullScreen
          />
        ) : (
          <div className='flex aspect-video items-center justify-center px-4 text-center text-zinc-400'>
            Select a movie to start playback.
          </div>
        )}
      </section>
    </main>
  )
}

export default MoviePlayer
