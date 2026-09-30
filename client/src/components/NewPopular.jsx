/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { FaCalendarAlt, FaPlay, FaStar } from 'react-icons/fa'
import { MdTrendingUp } from 'react-icons/md'
import Createcontext from './context/Createcontext'
import Popup from './Popup'
import Loader from './Loader'

const NewPopular = () => {
  const [popularMovies, setPopularMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [popularShows, setPopularShows] = useState([])
  const [airingShows, setAiringShows] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const { detail, display, setDetail, setDisplay, setSimilarid, setTvid } = useContext(Createcontext)

  useEffect(() => {
    setPageLoading(true)

    Promise.all([
      axios.get('https://tmdb.modiavii66.workers.dev/movies/popular?page=1'),
      axios.get('https://tmdb.modiavii66.workers.dev/movies/upcoming?page=1'),
      axios.get('https://tmdb.modiavii66.workers.dev/tv/popular?page=1'),
      axios.get('https://tmdb.modiavii66.workers.dev/tv/airing-today?page=1'),
    ])
      .then(([movies, upcoming, shows, airing]) => {
        setPopularMovies(movies?.data?.results || [])
        setUpcomingMovies(upcoming?.data?.results || [])
        setPopularShows(shows?.data?.results || [])
        setAiringShows(airing?.data?.results || [])
      })
      .finally(() => setPageLoading(false))
  }, [])

  const spotlight = upcomingMovies[0] || popularMovies[0] || popularShows[0]
  const ranked = [...popularMovies.slice(0, 5), ...popularShows.slice(0, 5)]
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 8)

  const mixedFeed = useMemo(() => {
    const movies = [...popularMovies.slice(1, 9), ...upcomingMovies.slice(1, 7)].map((item) => ({ ...item, mediaKind: 'movie' }))
    const shows = [...popularShows.slice(0, 8), ...airingShows.slice(0, 6)].map((item) => ({ ...item, mediaKind: 'tv' }))
    const feed = [...movies, ...shows].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))

    if (filter === 'movies') return feed.filter((item) => item.mediaKind === 'movie')
    if (filter === 'series') return feed.filter((item) => item.mediaKind === 'tv')
    return feed
  }, [airingShows, filter, popularMovies, popularShows, upcomingMovies])

  const releaseCalendar = [...upcomingMovies.slice(0, 6), ...airingShows.slice(0, 4)]
    .map((item) => ({ ...item, mediaKind: item.title ? 'movie' : 'tv' }))
    .sort((a, b) => new Date(a.release_date || a.first_air_date || 0) - new Date(b.release_date || b.first_air_date || 0))

  const openMovie = (movie) => {
    setDetail(movie)
    setSimilarid(movie.id)
    setTvid('')
    setDisplay(true)
  }

  const openShow = (show) => {
    setDetail(show)
    setTvid(show.id)
    setSimilarid('')
  }

  const openTitle = (item) => {
    if (item.mediaKind === 'tv' || !item.title) return openShow(item)
    return openMovie(item)
  }

  if (pageLoading) {
    return (
      <main className='mt-16 flex min-h-screen items-center justify-center bg-zinc-950 text-white sm:mt-20'>
        <Loader />
      </main>
    )
  }

  return (
    <main className='mt-16 min-h-screen bg-zinc-950 pb-14 text-white sm:mt-20 lg:pb-30'>
      <section className='grid gap-6 px-3 py-6 sm:px-6 lg:grid-cols-[1.45fr_0.85fr] lg:px-20 lg:py-10'>
        <Spotlight item={spotlight} onOpen={openTitle} />
        <TrendingPanel items={ranked} onOpen={openTitle} />
      </section>

      <section className='px-3 sm:px-6 lg:px-20'>
        <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.3em] text-red-400'>Release Watch</p>
            <h2 className='mt-1 text-2xl font-black'>This Week Watchlist</h2>
          </div>
          <div className='flex w-full gap-2 sm:w-auto'>
            {[
              ['all', 'All'],
              ['movies', 'Movies'],
              ['series', 'Series'],
            ].map(([value, label]) => (
              <button
                key={value}
                type='button'
                onClick={() => setFilter(value)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition sm:flex-none ${
                  filter === value ? 'bg-red-600 text-white' : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className='grid gap-4 lg:grid-cols-[0.9fr_1.4fr]'>
          <CalendarRail items={releaseCalendar} onOpen={openTitle} />
          <DiscoveryGrid items={mixedFeed.slice(0, 12)} onOpen={openTitle} />
        </div>
      </section>

      {display && detail && <Popup />}
    </main>
  )
}

const Spotlight = ({ item, onOpen }) => {
  if (!item) return null
  const isShow = !item.title

  return (
    <article className='relative min-h-[430px] overflow-hidden rounded-lg border border-white/10 bg-zinc-900'>
      <img
        src={item?.backdrop_path_full}
        alt={item?.title || item?.name}
        className='absolute inset-0 h-full w-full object-cover'
      />
      <div className='absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/10' />
      <div className='relative flex min-h-[430px] max-w-3xl flex-col justify-end p-5 sm:p-8'>
        <div className='mb-4 flex w-fit items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-red-300'>
          <MdTrendingUp className='text-lg' />
          Spotlight
        </div>
        <h1 className='line-clamp-2 text-4xl font-black sm:text-6xl'>{item?.title || item?.name}</h1>
        <p className='mt-3 line-clamp-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base'>{item?.overview}</p>
        <div className='mt-5 flex flex-wrap items-center gap-3'>
          {isShow ? (
            <NavLink
              to='/tvdetail'
              onClick={() => onOpen({ ...item, mediaKind: 'tv' })}
              className='inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500'
            >
              <FaPlay />
              Episodes
            </NavLink>
          ) : (
            <button
              type='button'
              onClick={() => onOpen({ ...item, mediaKind: 'movie' })}
              className='inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500'
            >
              <FaPlay />
              Details
            </button>
          )}
          <span className='flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-bold text-zinc-200'>
            <FaStar className='text-yellow-400' />
            {item?.vote_average?.toFixed(1) || 'New'}
          </span>
        </div>
      </div>
    </article>
  )
}

const TrendingPanel = ({ items, onOpen }) => (
  <aside className='rounded-lg border border-white/10 bg-white/[0.04] p-4'>
    <div className='mb-4 flex items-center justify-between'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.28em] text-red-400'>Ranked</p>
        <h2 className='mt-1 text-xl font-black'>Top Buzz</h2>
      </div>
      <MdTrendingUp className='text-3xl text-red-500' />
    </div>

    <div className='space-y-3'>
      {items.map((item, index) => {
        const isShow = !item.title
        const content = (
          <div className='grid grid-cols-[36px_56px_1fr] items-center gap-3 rounded-lg bg-zinc-950/70 p-2 transition hover:bg-white/10'>
            <span className='text-center text-lg font-black text-zinc-500'>{index + 1}</span>
            <img
              src={item?.poster_path_full || `https://image.tmdb.org/t/p/w200${item?.poster_path}`}
              alt={item?.title || item?.name}
              className='aspect-[2/3] rounded object-cover'
            />
            <div className='min-w-0'>
              <h3 className='line-clamp-1 text-sm font-bold text-white'>{item?.title || item?.name}</h3>
              <p className='mt-1 flex items-center gap-1 text-xs text-zinc-500'>
                <FaStar className='text-yellow-400' />
                {item?.vote_average?.toFixed(1) || 'New'} • {isShow ? 'Series' : 'Movie'}
              </p>
            </div>
          </div>
        )

        return isShow ? (
          <NavLink key={`tv-${item.id}`} to='/tvdetail' onClick={() => onOpen({ ...item, mediaKind: 'tv' })}>
            {content}
          </NavLink>
        ) : (
          <button key={`movie-${item.id}`} type='button' onClick={() => onOpen({ ...item, mediaKind: 'movie' })} className='w-full text-left'>
            {content}
          </button>
        )
      })}
    </div>
  </aside>
)

const CalendarRail = ({ items, onOpen }) => (
  <div className='rounded-lg border border-white/10 bg-white/[0.04] p-4'>
    <div className='mb-4 flex items-center gap-3'>
      <FaCalendarAlt className='text-red-500' />
      <h2 className='text-lg font-black'>Release Calendar</h2>
    </div>
    <div className='space-y-3'>
      {items.map((item) => {
        const date = item.release_date || item.first_air_date || 'Soon'
        const isShow = item.mediaKind === 'tv'
        return (
          <button
            key={`${item.mediaKind}-${item.id}`}
            type='button'
            onClick={() => onOpen(item)}
            className='grid w-full grid-cols-[86px_1fr] gap-3 rounded-lg border border-white/10 bg-zinc-950/70 p-3 text-left transition hover:border-red-500'
          >
            <div className='rounded bg-red-600/15 px-3 py-2 text-center'>
              <p className='text-xs font-bold uppercase text-red-300'>{date === 'Soon' ? 'Soon' : new Date(date).toLocaleString('en-US', { month: 'short' })}</p>
              <p className='text-2xl font-black text-white'>{date === 'Soon' ? '-' : new Date(date).getDate()}</p>
            </div>
            <div className='min-w-0'>
              <h3 className='line-clamp-1 font-bold text-white'>{item.title || item.name}</h3>
              <p className='mt-1 text-xs text-zinc-500'>{isShow ? 'Episode / Series update' : 'Movie release'}</p>
            </div>
          </button>
        )
      })}
    </div>
  </div>
)

const DiscoveryGrid = ({ items, onOpen }) => (
  <div className='grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4'>
    {items.map((item) => {
      const card = (
        <article className='group overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-red-500'>
          <div className='relative'>
            <img
              src={item?.poster_path_full || `https://image.tmdb.org/t/p/w500${item?.poster_path}`}
              alt={item?.title || item?.name}
              className='aspect-[2/3] w-full object-cover'
            />
            <span className='absolute left-2 top-2 rounded-full bg-zinc-950/80 px-3 py-1 text-xs font-bold text-white backdrop-blur'>
              {item.mediaKind === 'tv' ? 'Series' : 'Movie'}
            </span>
          </div>
          <div className='p-3'>
            <h3 className='line-clamp-1 text-sm font-bold text-white'>{item.title || item.name}</h3>
            <p className='mt-2 flex items-center gap-1 text-xs text-zinc-500'>
              <FaStar className='text-yellow-400' />
              {item?.vote_average?.toFixed(1) || 'New'}
            </p>
          </div>
        </article>
      )

      return item.mediaKind === 'tv' ? (
        <NavLink key={`tv-${item.id}`} to='/tvdetail' onClick={() => onOpen(item)}>
          {card}
        </NavLink>
      ) : (
        <button key={`movie-${item.id}`} type='button' onClick={() => onOpen(item)} className='text-left'>
          {card}
        </button>
      )
    })}
  </div>
)

export default NewPopular
