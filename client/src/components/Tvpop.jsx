import React, { useContext, useEffect, useState } from 'react'
import { FaPlay } from 'react-icons/fa'
import Createcontext from './context/Createcontext'
import { NavLink } from 'react-router-dom'
import axios from 'axios'

const Tvpop = () => {
  const { detail, tvid, setLoading, loading, selectedSeason, setSelectedSeason } = useContext(Createcontext)

  const [tvdata, setTvdata] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [showDetail, setShowDetail] = useState(detail)

  useEffect(() => {
    if (!tvid) return

    setLoading(true)
    axios
      .get(`https://api.themoviedb.org/3/tv/${tvid}?api_key=8feaa6410559e6461f3c6544a5ca30da`)
      .then((res) => {
        const data = res?.data
        setShowDetail((current) => current || data)
        const totalSeasons = data?.number_of_seasons || 0
        const seasonsArr = Array.from({ length: totalSeasons }, (_, i) => i + 1)
        setTvdata(seasonsArr)
        if (totalSeasons > 0) setSelectedSeason(1)
      })
      .finally(() => setLoading(false))
  }, [tvid, setLoading, setSelectedSeason])

  useEffect(() => {
    if (!selectedSeason || !tvid) return

    setLoading(true)
    axios
      .get(`https://api.themoviedb.org/3/tv/${tvid}/season/${selectedSeason}?api_key=8feaa6410559e6461f3c6544a5ca30da`)
      .then((res) => setEpisodes(res.data.episodes || []))
      .finally(() => setLoading(false))
  }, [selectedSeason, tvid, setLoading])

  const backdrop = showDetail?.backdrop_path_full || `https://image.tmdb.org/t/p/original${showDetail?.backdrop_path}`

  return (
    <main className='mt-16 min-h-screen bg-zinc-950 pb-10 text-white sm:mt-20'>
      <section className='relative'>
        <img src={backdrop} className='h-[260px] w-full object-cover sm:h-[360px] xl:h-[430px]' alt={showDetail?.name || 'TV show'} />
        <div className='absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/45 to-transparent' />
        <div className='absolute bottom-7 left-4 max-w-3xl space-y-3 sm:left-8 lg:left-24'>
          <p className='text-xs font-semibold uppercase tracking-[0.32em] text-red-400'>Series</p>
          <h1 className='line-clamp-2 text-3xl font-black sm:text-5xl'>{showDetail?.name || 'Select a series'}</h1>
          <p className='line-clamp-3 max-w-2xl text-sm text-zinc-300 sm:text-base'>{showDetail?.overview}</p>
        </div>
      </section>

      <section className='sticky top-16 z-30 border-b border-white/10 bg-zinc-950/95 px-3 py-4 backdrop-blur sm:top-20 sm:px-6 lg:px-24'>
        <h2 className='mb-4 text-lg font-bold'>Episodes</h2>
        <div className='flex gap-2 overflow-x-auto scrollbar-hide'>
          {tvdata.map((season) => (
            <button
              type='button'
              key={season}
              onClick={() => setSelectedSeason(season)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedSeason === season ? 'bg-red-600 text-white' : 'bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              Season {season}
            </button>
          ))}
        </div>
      </section>

      <section className='space-y-4 px-3 py-6 sm:px-6 lg:px-24'>
        {loading && <p className='text-zinc-400'>Loading episodes...</p>}

        {!loading &&
          episodes.map((ep) => (
            <article key={ep.id} className='grid grid-cols-[120px_1fr] gap-4 rounded-lg border border-white/10 bg-white/5 p-2 sm:grid-cols-[210px_1fr] sm:p-3'>
              <div className='relative aspect-video overflow-hidden rounded-md bg-zinc-900'>
                <img
                  src={ep.still_path ? `https://image.tmdb.org/t/p/w500${ep.still_path}` : 'https://via.placeholder.com/300x170?text=No+Image'}
                  className='h-full w-full object-cover'
                  alt={ep.name}
                />

                <NavLink
                  to={`/play/tv/${tvid}/${selectedSeason}/${ep.episode_number}`}
                  className='absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/35'
                >
                  <span className='flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white shadow-lg'>
                    <FaPlay />
                  </span>
                </NavLink>
              </div>

              <div className='min-w-0 py-1'>
                <h3 className='line-clamp-1 text-sm font-bold text-white sm:text-lg'>{ep.name}</h3>
                <p className='mt-1 text-xs text-zinc-500 sm:text-sm'>
                  S{selectedSeason} E{ep.episode_number} {ep.air_date ? `- ${ep.air_date}` : ''}
                </p>
                <p className='mt-2 line-clamp-3 text-sm text-zinc-400'>{ep.overview || 'No description available'}</p>
              </div>
            </article>
          ))}
      </section>
    </main>
  )
}

export default Tvpop
