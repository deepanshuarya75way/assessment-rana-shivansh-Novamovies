import React, { useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'

const TvPlayer = () => {
  const { tvId, season, episode } = useParams()

  useEffect(() => {
    document.title = 'Episode playing | Novamovies'
  }, [])

  const canPlay = tvId && season && episode

  return (
    <main className='min-h-screen bg-zinc-950 px-3 pb-8 pt-20 text-white sm:px-6 sm:pt-24 lg:px-24'>
      <div className='mb-4 flex items-center justify-between'>
        <NavLink
          to='/tvdetail'
          className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15'
        >
          <IoArrowBack />
          Episodes
        </NavLink>
        <p className='text-xs font-medium uppercase tracking-[0.28em] text-zinc-500'>
          S{season || '-'} E{episode || '-'}
        </p>
      </div>

      <section className='overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl shadow-black/40'>
        {canPlay ? (
          <iframe
            src={`https://player.videasy.net/tv/${tvId}/${season}/${episode}`}
            className='aspect-video w-full'
            title='TV episode player'
            frameBorder='0'
            allowFullScreen
          />
        ) : (
          <div className='flex aspect-video items-center justify-center px-4 text-center text-zinc-400'>
            Select an episode to start playback.
          </div>
        )}
      </section>
    </main>
  )
}

export default TvPlayer
