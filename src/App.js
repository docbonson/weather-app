import React, { useEffect, useState } from 'react'
import warmBg from './assets/warm.jpg'
import coldBg from './assets/cold.jpg'
import Descriptions from './components/Descriptions'
import { getFormattedWeatherData } from './WeatherService'

function App() {
  const [location, setLocation] = useState({ city: 'Madison', stateCode: 'WI' })
  const [weather, setWeather] = useState(null)
  const [units, setUnits] = useState('imperial')
  const [bg, setBg] = useState(warmBg)
  const [backgroundThreshold, setBackgroundThreshold] = useState(
    units === 'metric' ? 15 : 59,
  )
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getFormattedWeatherData(
          `${location.city},${location.stateCode}`,
          units,
        )
        setWeather(data)
        setError(null) // Reset error if successful

        // Dynamic background
        if (data.temp <= backgroundThreshold) setBg(coldBg)
        else setBg(warmBg)
      } catch (error) {
        setWeather(null)
        setError('Error fetching weather data. Please try again.')
        console.error('Weather API Error:', error)
      }
    }

    fetchWeatherData()
  }, [units, location, backgroundThreshold])

  const handleUnitsClick = (e) => {
    const button = e.currentTarget
    const currentUnit = button.innerText.slice(1)

    const isCelsius = currentUnit === 'C'
    button.innerText = isCelsius ? '°F' : '°C'
    setUnits(isCelsius ? 'metric' : 'imperial')
    setBackgroundThreshold(isCelsius ? 15 : 59)
  }

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      const [city, stateCode] = e.currentTarget.value.split(',')
      setLocation({ city, stateCode })
      e.currentTarget.blur()
    }
  }

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {error && <div className="error-message">{error}</div>}
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <input
                onKeyDown={enterKeyPressed}
                type="text"
                name="city"
                placeholder="Enter City,State..."
              />
              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>
            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${
                  units === 'metric' ? 'C' : 'F'
                }`}</h1>
              </div>
            </div>
            {/* bottom description */}
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
