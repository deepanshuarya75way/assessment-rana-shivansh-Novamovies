
import React, { useContext } from 'react'
import Createcontext from './context/Createcontext'
import { useNavigate } from 'react-router-dom'

const Searchmovie = () => {
  const { searchmovie, search, setDetail, setDisplay, setSearch, setSimilarid, setTvid } = useContext(Createcontext)
  const navigate = useNavigate()

  // hide if no search
  if (!search) return null

  return (
    <div className='absolute right-0 top-12 z-50 max-h-100 w-[min(92vw,420px)] overflow-y-auto rounded-lg border border-white/10 bg-zinc-950 p-2 text-white shadow-2xl shadow-black/40'>

      {
        searchmovie?.length > 0 ? (
          searchmovie.map((data) => (
            <div
              key={data.id}
              onClick={() => {
                setDetail(data)
                setSearch('')
                if (data.media_type === 'tv') {
                  setTvid(data.id)
                  setSimilarid('')
                  navigate('/tvdetail')
                } else {
                  setSimilarid(data.id)
                  setDisplay(true)
                }
              }}
              className='flex cursor-pointer gap-3 rounded-lg p-2 hover:bg-white/10'
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${data?.poster_path}`}
                className='h-16 w-12 rounded-md object-cover'
                alt=""
              />

              <div>
                <h2 className='text-sm font-semibold'>
                  {data.title || data.name}
                </h2>
                <p className='text-xs text-zinc-400'>
                  {data.release_date || data.first_air_date}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className='py-4 text-center text-zinc-400'>No results found</p>
        )
      }

    </div>
  )
}

export default Searchmovie
