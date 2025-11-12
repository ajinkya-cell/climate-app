"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Loader2, MapPin } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

const WeatherTips = () => {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(null)

  // 🧭 Get user location first
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          })
        },
        () => setError("Unable to access location")
      )
    } else {
      setError("Geolocation not supported")
    }
  }, [])

  // 🌤️ Fetch weather once we have coordinates
  useEffect(() => {
    const fetchWeather = async () => {
      if (!position) return
      setLoading(true)
      try {
        const API_KEY = process.env.VITE_OPENWEATHER_API_KEY// replace with your key
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${position.lat}&lon=${position.lon}&units=metric&appid=${API_KEY}`
        )
        const data = await res.json()
        setWeather(data)
      } catch (err) {
        setError("Failed to fetch weather")
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [position])

  // 🧠 Generate basic do's and don'ts based on temperature
  const getWeatherAdvice = (temp: number, condition: string) => {
    const tips: { dos: string[]; donts: string[] } = { dos: [], donts: [] }

    if (temp < 0) {
      tips.dos.push("Wear a heavy coat, gloves, and a scarf.")
      tips.dos.push("Stay indoors if possible.")
      tips.donts.push("Avoid staying outside for long periods.")
    } else if (temp < 10) {
      tips.dos.push("Dress warmly with layers.")
      tips.donts.push("Don’t forget to cover your ears and hands.")
    } else if (temp < 20) {
      tips.dos.push("Carry a light jacket or sweater.")
      tips.donts.push("Avoid going out without a jacket in the evening.")
    } else if (temp < 30) {
      tips.dos.push("Perfect for outdoor walks — enjoy the weather!")
      tips.donts.push("Don’t forget to stay hydrated.")
    } else {
      tips.dos.push("Drink plenty of water and stay in shade.")
      tips.donts.push("Avoid heavy outdoor activity in midday heat.")
    }

    if (condition.includes("rain")) {
      tips.dos.push("Carry an umbrella or wear a raincoat.")
      tips.donts.push("Avoid leaving electronics uncovered.")
    }
    if (condition.includes("snow")) {
      tips.dos.push("Wear boots with good grip.")
      tips.donts.push("Avoid driving if roads are icy.")
    }

    return tips
  }

  if (loading)
    return (
      <Card className="p-6 flex justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </Card>
    )

  if (error)
    return (
      <Card className="p-6 text-center text-red-500 font-medium">
        {error}
      </Card>
    )

  if (!weather) return null

  const { name, main, weather: w } = weather
  const condition = w[0].main.toLowerCase()
  const temp = main.temp
  const tips = getWeatherAdvice(temp, condition)

  const icon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
    iconSize: [35, 35],
  })

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-muted-foreground">
              {Math.round(temp)}°C — {w[0].description}
            </p>
          </div>
          <MapPin className="text-blue-500" />
        </div>

        {/* 🌡️ Tips */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-xl">
            <h3 className="font-semibold text-blue-600 mb-2">✅ Do’s</h3>
            <ul className="text-sm list-disc pl-4 space-y-1">
              {tips.dos.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-950 p-4 rounded-xl">
            <h3 className="font-semibold text-red-600 mb-2">❌ Don’ts</h3>
            <ul className="text-sm list-disc pl-4 space-y-1">
              {tips.donts.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        🗺️ Minimal Weather Map
        {position && (
          <div className="h-64 w-full rounded-xl overflow-hidden">
            <MapContainer
              center={[position.lat, position.lon]}
              zoom={10}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[position.lat, position.lon]} icon={icon}>
                <Popup>
                  <strong>{name}</strong>
                  <br />
                  {Math.round(temp)}°C — {w[0].main}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WeatherTips
