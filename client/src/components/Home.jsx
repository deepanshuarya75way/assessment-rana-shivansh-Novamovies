/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import Createcontext from './context/Createcontext'
import Popup from './Popup'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import Loader from './Loader'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay } from 'swiper/modules'
import { FaPlay, FaStar } from 'react-icons/fa'

const MainContent = () => {
  const [homemovie, setHomemovie] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [topRated, setTopRated] = useState([])

  const {
    detail,
    setDetail,
    display,
    setDisplay,
    movies,
    setSimilarid,
    setLoading,
    loading,
    setTvid,
  } = useContext(Createcontext)

  useEffect(() => {
    if (movies) setHomemovie(movies.slice(0, 5))
  }, [movies])

  useEffect(() => {
    setLoading(true)
    axios
      .get('https://tmdb.modiavii66.workers.dev/tv/popular?page=1')
      .then((res) => setTopRated(res.data.results))
      .finally(() => setLoading(false))
  }, [setLoading])

  useEffect(() => {
    setLoading(true)
    axios
      .get('https://tmdb.modiavii66.workers.dev/movies/upcoming?page=1')
      .then((res) => setUpcoming(res.data.results))
      .finally(() => setLoading(false))
  }, [setLoading])

  const openMovie = (movie) => {
    setDetail(movie)
    setDisplay(true)
    setSimilarid(movie.id)
    setTvid('')
  }

  return (
    <main className='mt-16 min-h-screen bg-zinc-950 px-3 pb-14 text-white sm:mt-20 sm:px-5 lg:px-0 lg:pb-30'>
      <section className='relative overflow-hidden'>
        <Swiper modules={[Autoplay]} slidesPerView={1} spaceBetween={3} loop autoplay={{ delay: 2800 }}>
          {homemovie?.map((data) => (
            <SwiperSlide key={data.id} className='relative'>
              <img
                src={data?.backdrop_path_full}
                alt={data?.title || 'Featured movie'}
                className='h-[260px] w-full object-cover sm:h-[360px] xl:h-[500px]'
              />
              <div className='absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent' />
              <div className='absolute bottom-8 left-4 max-w-2xl space-y-3 sm:bottom-12 sm:left-10 lg:left-24'>
                <p className='text-xs font-semibold uppercase tracking-[0.32em] text-red-400'>Featured Movie</p>
                <h1 className='line-clamp-2 text-3xl font-black sm:text-5xl'>{data?.title}</h1>
                <p className='line-clamp-2 max-w-xl text-sm text-zinc-300 sm:text-base'>{data?.overview}</p>
                <NavLink
                  to={`/play/movie/${data.id}`}
                  onClick={() => setDetail(data)}
                  className='inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500'
                >
                  <FaPlay />
                  Play Now
                </NavLink>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <MediaRow title='Trending Now' loading={loading} items={movies} type='movie' onMovieClick={openMovie} />
      <MediaRow
        title='Top Rated Shows'
        loading={loading}
        items={topRated}
        type='tv'
        onTvClick={(show) => {
          setTvid(show.id)
          setDetail(show)
        }}
      />
      <MediaRow title='Coming Soon' loading={loading} items={upcoming} type='movie' onMovieClick={openMovie} />

      {display && detail && <Popup />}
    </main>
  )
}

const MediaRow = ({ title, loading, items, type, onMovieClick, onTvClick }) => (
  <section className='mt-10 px-1 sm:px-5 lg:px-20'>
    <h2 className='mb-4 text-xl font-bold tracking-wide text-white sm:text-2xl'>{title}</h2>
    <div className='flex gap-4 overflow-x-auto pb-3 scrollbar-hide'>
      {loading ? (
        <Loader />
      ) : (
        items?.map((data) =>
          type === 'tv' ? (
            <NavLink
              to='/tvdetail'
              key={data.id}
              onClick={() => onTvClick(data)}
              className='group w-36 shrink-0 cursor-pointer sm:w-40'
            >
              <Poster data={data} />
            </NavLink>
          ) : (
            <article key={data.id} onClick={() => onMovieClick(data)} className='group w-36 shrink-0 cursor-pointer sm:w-40'>
              <Poster data={data} />
            </article>
          ),
        )
      )}
    </div>
  </section>
)

const Poster = ({ data }) => (
  <>
    <img
      src={data?.poster_path_full || `https://image.tmdb.org/t/p/w500${data?.poster_path}`}
      alt={data?.title || data?.name || 'Poster'}
      className=' w-full rounded-lg object-cover shadow-lg shadow-black/30 transition duration-300 group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-red-500'
    />
    <h3 className='mt-2 line-clamp-1 text-sm font-semibold text-zinc-200'>{data?.title || data?.name}</h3>
    <p className='mt-1 flex items-center gap-1 text-xs text-zinc-500'>
      <FaStar className='text-yellow-400' />
      {data?.vote_average?.toFixed(1) || 'New'}
    </p>
  </>
)

export default MainContent
