import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import MainContent from './components/Home'
import Sidebar from './components/Sidebar'
import Tvseries from './components/Tvseries'
import Tvpop from './components/Tvpop'
import Footer from './components/Footer'
import MoviePlayer from './components/MoviePlayer'
import TvPlayer from './components/TvPlayer'
import NewPopular from './components/NewPopular'

const API_URL = ''

const SessionLogin = ({ onLogin }) => {
  const [userid, setUserid] = useState('')
  const [deviceName, setDeviceName] = useState('')
  const [existingSession, setExistingSession] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {
    setError('')

    if (!userid.trim()) {
      setError('Please enter User ID')
      return
    }

    const device =
      deviceName.trim() ||
      `${navigator.platform} - Browser`

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid: userid.trim(),
          deviceName: device,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      /*
       * Backend found an existing session.
       * Show the current device before takeover.
       */
      if (data.previousSession) {
        setExistingSession(data.previousSession)
        return
      }

      if (data.session) {
        localStorage.setItem('userid', userid.trim())
        localStorage.setItem('sessionId', data.session.sessionId)

        onLogin(data.session)
      }
    } catch (err) {
      console.error(err)
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const takeover = async () => {
    setError('')
    setLoading(true)

    const device =
      deviceName.trim() ||
      `${navigator.platform} - Browser`

    try {
      const response = await fetch(
        `${API_URL}/api/session/takeover`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userid: userid.trim(),
            deviceName: device,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Session takeover failed')
        return
      }

      if (data.session) {
        localStorage.setItem('userid', userid.trim())
        localStorage.setItem('sessionId', data.session.sessionId)

        onLogin(data.session)
      }
    } catch (err) {
      console.error(err)
      setError('Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#111',
        color: '#fff',
      }}
    >
      <div
        style={{
          width: '360px',
          padding: '30px',
          background: '#222',
          borderRadius: '10px',
        }}
      >
        <h2>NovaMovies Login</h2>

        {!existingSession ? (
          <>
            <input
              type="text"
              placeholder="User ID"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '12px',
                boxSizing: 'border-box',
              }}
            />

            <input
              type="text"
              placeholder="Device name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '15px',
                boxSizing: 'border-box',
              }}
            />

            <button
              onClick={login}
              disabled={loading}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </>
        ) : (
          <>
            <h3>Existing Session Found</h3>

            <p>
              This account is already logged in on:
            </p>

            <p>
              <strong>
                {existingSession.deviceName || 'Unknown device'}
              </strong>
            </p>

            {existingSession.loginAt && (
              <p>
                Logged in at:{' '}
                {new Date(
                  existingSession.loginAt
                ).toLocaleString()}
              </p>
            )}

            <p>
              Do you want to take over this session?
            </p>

            <button
              onClick={takeover}
              disabled={loading}
              style={{
                padding: '10px 15px',
                marginRight: '10px',
                cursor: 'pointer',
              }}
            >
              {loading
                ? 'Taking over...'
                : 'Take Over Session'}
            </button>

            <button
              onClick={() => setExistingSession(null)}
              disabled={loading}
              style={{
                padding: '10px 15px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </>
        )}

        {error && (
          <p style={{ color: '#ff5555', marginTop: '15px' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

const movie = () => {
  const [session, setSession] = useState(() => {
    const userid = localStorage.getItem('userid')
    const sessionId = localStorage.getItem('sessionId')

    if (!userid || !sessionId) {
      return null
    }

    return {
      userid,
      sessionId,
    }
  })

  /*
   * Check the current session periodically.
   *
   * If another device takes over the account,
   * the backend returns valid:false and this device
   * is sent back to the login screen.
   */
  useEffect(() => {
    if (!session) {
      return
    }

    const checkSession = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/session/${session.userid}/${session.sessionId}`
        )

        const data = await response.json()

        if (!data.valid) {
          localStorage.removeItem('userid')
          localStorage.removeItem('sessionId')
          setSession(null)
        }
      } catch (err) {
        console.error('Session check failed:', err)
      }
    }

    checkSession()

    const interval = setInterval(
      checkSession,
      3000
    )

    return () => clearInterval(interval)
  }, [session])

  /*
   * No valid session -> show login.
   */
  if (!session) {
    return (
      <SessionLogin
        onLogin={(newSession) => {
          setSession(newSession)
        }}
      />
    )
  }

  /*
   * Existing NovaMovies application.
   */
  return (
    <>
      <Navbar />

      <Sidebar />

      <Routes>
        <Route
          path="/"
          element={<MainContent />}
        />

        <Route
          path="/play/movie/:movieId"
          element={<MoviePlayer />}
        />

        <Route
          path="/play/tv/:tvId/:season/:episode"
          element={<TvPlayer />}
        />

        <Route
          path="/tvseries"
          element={<Tvseries />}
        />

        <Route
          path="/tvdetail"
          element={<Tvpop />}
        />

        <Route
          path="/new-popular"
          element={<NewPopular />}
        />
      </Routes>

      <Footer />
    </>
  )
}

export default movie