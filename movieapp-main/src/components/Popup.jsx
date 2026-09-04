import React, { useContext, useEffect, useRef, useState } from 'react'
import { MdCancel } from 'react-icons/md'
import { FaPlay, FaStar } from 'react-icons/fa'
import Createcontext from './context/Createcontext'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import Loader from './Loader'

const Popup = () => {
  const { detail, handledisplay, setDetail, setDisplay, similarid, loading, setLoading } = useContext(Createcontext)
  const [popupmovie, setPopupmovie] = useState([])
  const modalScrollRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  useEffect(() => {
    if (!similarid) return

    setLoading(true)
    axios
      .get(`https://api.themoviedb.org/3/movie/${similarid}/similar?api_key=8feaa6410559e6461f3c6544a5ca30da`)
      .then((res) => setPopupmovie(res.data.results || []))
      .finally(() => setLoading(false))
  }, [similarid, setLoading])

  const genreMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    18: 'Drama',
    14: 'Fantasy',
    27: 'Horror',
    878: 'Sci-Fi',
    53: 'Thriller',
    10749: 'Romance',
    10751: 'Family',
  }

  const genres = detail?.genre_ids?.map((id) => genreMap[id]).filter(Boolean)
  const backdrop = detail?.backdrop_path_full || `https://image.tmdb.org/t/p/original${detail?.backdrop_path}`

  const handleSimilarClick = (movie) => {
    setDetail(movie)
    setDisplay(true)
    modalScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={modalScrollRef} className='fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-2 backdrop-blur-sm md:p-4'>
      <div className='w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-zinc-950 text-white shadow-2xl shadow-black/50'>
        <div className='relative'>
          <MdCancel
            className='absolute right-4 top-4 z-10 cursor-pointer text-4xl text-white drop-shadow hover:text-red-500'
            onClick={handledisplay}
          />

          <img src={backdrop} className='h-75 w-full object-cover sm:h-100' alt={detail?.title || 'Movie backdrop'} />
          <div className='absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/35 to-transparent' />

          <NavLink
            to={`/play/movie/${detail?.id}`}
            className='absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500'
          >
            <FaPlay />
            Play
          </NavLink>
        </div>

        <div className='space-y-4 p-6'>
          <h1 className='text-2xl font-bold sm:text-3xl'>{detail?.title || detail?.name}</h1>

          <div className='flex flex-wrap gap-2'>
            {genres?.map((g) => (
              <span key={g} className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300'>
                {g}
              </span>
            ))}
          </div>

          <p className='text-sm leading-relaxed text-zinc-300 sm:text-base'>{detail?.overview}</p>
          <p className='text-sm text-zinc-500'>{detail?.release_date || detail?.first_air_date}</p>
        </div>

        <div className='p-6 pt-0'>
          <h2 className='mb-4 text-xl font-bold sm:text-2xl'>More Like This</h2>

          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
            {loading ? (
              <Loader />
            ) : (
              popupmovie?.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSimilarClick(movie)}
                  className='cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-red-500'
                >
                  <img src={`https://image.tmdb.org/t/p/w500${movie?.backdrop_path}`} className='h-32 w-full object-cover' alt={movie?.title} />
                  <div className='space-y-2 p-3'>
                    <div className='flex items-center justify-between gap-2'>
                      <p className='text-xs text-zinc-400'>{movie?.release_date}</p>
                      <div className='flex items-center gap-1 rounded bg-yellow-400 px-2 py-1 text-xs text-black'>
                        {movie?.vote_average?.toFixed(1)}
                        <FaStar />
                      </div>
                    </div>
                    <p className='line-clamp-3 text-sm text-zinc-300'>{movie?.overview}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Popup
