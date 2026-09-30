/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import Createcontext from './Createcontext'
import axios from 'axios'

const Providecontext = ({ children }) => {
  const [movies, setMovies] = useState([])
  const [detail, setDetail] = useState(null)
  const [display, setDisplay] = useState(false)
  // const [displaymovie, setDisplaymovie] = useState(false)
  const [search, setSearch] = useState("")
  const [similarid, setSimilarid] = useState("")
  const [searchmovie, setSearchmovie] = useState([])
  const [tvid, setTvid] = useState("")
  const [loading, setLoading] = useState(false);
  const [selectseasonn, setSelectedSeasonn] = useState([])
  const [selectepisode, setSelectepisode] = useState([])
  const [selectedSeason, setSelectedSeason] = useState(null)
  const [sidebardisplay, setSidebardisplay] = useState(false)
       

  useEffect(() => {
    setLoading(true)
    axios.get("https://tmdb.modiavii66.workers.dev/movies/popular?page=1")
      .then(res => {
        setMovies(res.data.results)
      })
      .finally(() => setLoading(false));
  }, [])
 
  useEffect(() => {
  const timer = setTimeout(() => {
    if (search) {
      axios
        .get(`https://tmdb.modiavii66.workers.dev/search/multi?query=${search}&page=1`)
        .then((res) => {
          setSearchmovie(res?.data?.results);
          console.log(res.data);
        });
    }
  }, 500);

  return () => clearTimeout(timer);
}, [search]);

  const handledisplay = () => {
    setDisplay(!display)
  }

  return (
    <Createcontext.Provider value={{
      detail,
      setDetail,
      display,
      setDisplay, handledisplay,
      // setDisplaymovie,
      // displaymovie,
      movies, setSearch,
      search, setSimilarid,
       similarid, setSearchmovie,
        searchmovie, tvid, setTvid,
         loading, setLoading,
          selectseasonn, selectepisode,
           setSelectedSeasonn, setSelectepisode, 
           selectedSeason, setSelectedSeason,
  sidebardisplay, setSidebardisplay


    }}> {children}</Createcontext.Provider>
  )
}

export default Providecontext
