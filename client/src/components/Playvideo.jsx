import React, { useContext, useEffect } from 'react'
import Createcontext from './context/Createcontext'

const Playvideo = () => {
    const {
     selectedSeason,selectepisode,tvid,id
    } = useContext(Createcontext)

    useEffect(()=>{
       document.title="video play"
    },[])
  return (
    <div className=''>
    
        { 
  (
    <div className='relative w-full  aspect-video'>
      {
        id && !tvid && (
           <iframe
    src={`https://player.videasy.net/movie/${id}`}
    className='absolute top-8 left-0 w-full h-full'

    frameBorder="0"
    allowFullScreen
  ></iframe>

        )
      }

      {
        tvid && selectedSeason && selectepisode && (
           <iframe
    src={`https://player.videasy.net/tv/${tvid}/${selectedSeason}/${selectepisode}`}
    className='absolute top-8 left-0 w-full h-full'

    frameBorder="0"
    allowFullScreen
  ></iframe>

        )
      }
 
</div>
  

  )
 }

    </div>
  )
}

export default Playvideo
