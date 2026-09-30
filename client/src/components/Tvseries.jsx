/* eslint-disable react/prop-types */
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Createcontext from './context/Createcontext'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/autoplay'
import { Autoplay } from 'swiper/modules'
import { FaPlay, FaStar } from 'react-icons/fa'

const Tvseries = () => {
  const [alltvshows, setAlltvshows] = useState([])
  const [othershow, setOthershow] = useState([])
  const [homeshow, setHomeshow] = useState([])

  const { setDetail, setTvid } = useContext(Createcontext)

  useEffect(() => {
    axios.get('https://tmdb.modiavii66.workers.dev/tv/popular?page=1').then((res) => setAlltvshows(res?.data?.results || []))
  }, [])

  useEffect(() => {
    setHomeshow(alltvshows.slice(0, 5))
  }, [alltvshows])

  useEffect(() => {
    axios.get('https://tmdb.modiavii66.workers.dev/tv/airing-today?page=1').then((res) => setOthershow(res?.data?.results || []))
  }, [])

  const openShow = (show) => {
    setDetail(show)
    setTvid(show.id)
  }

  return (
    <main className='mt-16 min-h-screen bg-zinc-950 px-3 pb-14 text-white sm:mt-20 sm:px-5 lg:px-0 lg:pb-30'>
      <section className='relative overflow-hidden'>
        {homeshow.length > 0 && (
          <Swiper
            key={homeshow.map((show) => show.id).join('-')}
            modules={[Autoplay]}
            slidesPerView={1}
            spaceBetween={3}
            loop={homeshow.length > 1}
            autoplay={{ delay: 2800, disableOnInteraction: false }}
          >
            {homeshow.map((data) => (
              <SwiperSlide key={data.id} className='relative'>
                <img
                  src={data?.backdrop_path_full}
                  alt={data?.name || 'Featured show'}
                  className='h-[260px] w-full object-cover sm:h-[360px] xl:h-[500px]'
                />
                <div className='absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent' />
                <div className='absolute bottom-8 left-4 max-w-2xl space-y-3 sm:bottom-12 sm:left-10 lg:left-24'>
                  <p className='text-xs font-semibold uppercase tracking-[0.32em] text-red-400'>Featured Series</p>
                  <h1 className='line-clamp-2 text-3xl font-black sm:text-5xl'>{data?.name}</h1>
                  <p className='line-clamp-2 max-w-xl text-sm text-zinc-300 sm:text-base'>{data?.overview}</p>
                  <NavLink
                    to='/tvdetail'
                    onClick={() => openShow(data)}
                    className='inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500'
                  >
                    <FaPlay />
                    Episodes
                  </NavLink>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      <TvRow title='Popular Shows' shows={alltvshows} onOpen={openShow} />
      <TvRow title='Airing Today' shows={othershow} onOpen={openShow} />
    </main>
  )
}

const TvRow = ({ title, shows, onOpen }) => (
  <section className='mt-10 px-1 sm:px-5 lg:px-20'>
    <h2 className='mb-4 text-xl font-bold tracking-wide text-white sm:text-2xl'>{title}</h2>
    <div className='flex gap-4 overflow-x-auto pb-3 scrollbar-hide'>
      {shows.map((data) => (
        <NavLink to='/tvdetail' key={data.id} onClick={() => onOpen(data)} className='group w-36 shrink-0 cursor-pointer sm:w-40'>
          <img
            src={data?.poster_path_full}
            className='aspect-[2/3] w-full rounded-lg object-cover shadow-lg shadow-black/30 transition duration-300 group-hover:-translate-y-1 group-hover:ring-2 group-hover:ring-red-500'
            alt={data?.name || 'TV show poster'}
          />
          <h3 className='mt-2 line-clamp-1 text-sm font-semibold text-zinc-200'>{data?.name}</h3>
          <p className='mt-1 flex items-center gap-1 text-xs text-zinc-500'>
            <FaStar className='text-yellow-400' />
            {data?.vote_average?.toFixed(1) || 'New'}
          </p>
        </NavLink>
      ))}
    </div>
  </section>
)

export default Tvseries
