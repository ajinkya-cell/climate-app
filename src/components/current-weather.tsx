import type { GeocodingResponse, WeatherData } from "@/api/types"
import { Card, CardContent } from "./ui/card"
import { ArrowDown, ArrowUp, Droplets, Wind, CloudRain, Sun, Snowflake, Cloud, Thermometer } from "lucide-react"

interface CurrentWeatherProps {
  data: WeatherData
  locationName?: GeocodingResponse
}

const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data

  const formatTemp = (temp: number) => `${Math.round(temp)}°`

  // 🌡️ Smart clothing suggestion logic
  const getClothingSuggestion = (temperature: number, condition: string) => {
    const lowerCondition = condition.toLowerCase()

    if (lowerCondition.includes("snow")) {
      return {
        icon: <Snowflake className="w-5 h-5 text-blue-400" />,
        text: "☃️ It's snowy — wear a heavy coat, gloves, boots, and a beanie.",
      }
    }
    if (lowerCondition.includes("rain")) {
      return {
        icon: <CloudRain className="w-5 h-5 text-blue-500" />,
        text: "🌧️ It's rainy — take an umbrella or a waterproof jacket.",
      }
    }
    if (lowerCondition.includes("cloud")) {
      return {
        icon: <Cloud className="w-5 h-5 text-gray-400" />,
        text: "☁️ Cloudy — a light jacket or hoodie is perfect.",
      }
    }
    if (lowerCondition.includes("clear") || lowerCondition.includes("sun")) {
      if (temperature > 30) {
        return {
          icon: <Sun className="w-5 h-5 text-yellow-400" />,
          text: "😎 Sunny & hot — wear light cotton clothes and stay hydrated.",
        }
      } else if (temperature > 20) {
        return {
          icon: <Sun className="w-5 h-5 text-yellow-400" />,
          text: "☀️ Pleasant — T-shirt, jeans, or casual wear are great.",
        }
      }
    }

    // Temperature-based fallback
    if (temperature < 0) {
      return {
        icon: <Thermometer className="w-5 h-5 text-blue-700" />,
        text: "❄️ Freezing cold — wear a thick winter jacket, scarf, and gloves.",
      }
    } else if (temperature < 10) {
      return {
        icon: <Thermometer className="w-5 h-5 text-blue-500" />,
        text: "🧣 Cold — wear a jacket or sweater and stay warm.",
      }
    } else if (temperature < 20) {
      return {
        icon: <Thermometer className="w-5 h-5 text-blue-300" />,
        text: "🧥 Cool — a light jacket or hoodie will do.",
      }
    } else if (temperature < 28) {
      return {
        icon: <Thermometer className="w-5 h-5 text-orange-300" />,
        text: "👕 Mild — T-shirt and jeans are comfortable.",
      }
    } else {
      return {
        icon: <Thermometer className="w-5 h-5 text-red-500" />,
        text: "🔥 Hot — wear breathable clothes and drink water often.",
      }
    }
  }

  const suggestion = getClothingSuggestion(temp, currentWeather.main)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold tracking-tight">{locationName?.name}</h2>
                {locationName?.state && (
                  <span className="text-lg text-muted-foreground">, {locationName.state}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{locationName?.country}</p>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-7xl font-bold tracking-tighter">{formatTemp(temp)}</p>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Feels like {formatTemp(feels_like)}
                </p>
                <div className="flex gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowUp className="h-3 w-3" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-sm text-muted-foreground">{humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Wind Speed</p>
                  <p className="text-sm text-muted-foreground">{speed} m/s</p>
                </div>
              </div>
            </div>

            {/* 🧥 Clothing Suggestion Section */}
            <div className="mt-4 p-4 rounded-2xl bg-muted/40 flex items-start gap-3">
              {suggestion.icon}
              <div>
                <p className="text-sm font-semibold">Clothing Suggestion</p>
                <p className="text-sm text-muted-foreground">{suggestion.text}</p>
              </div>
            </div>
          </div>

          {/* Right section (weather icon & description) */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-[200px] items-center justify-center">
              <img
                className="h-full w-full object-contain"
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
                alt={currentWeather.description}
              />
              <div className="absolute bottom-0 text-center">
                <p className="text-sm font-medium capitalize">{currentWeather.description}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CurrentWeather
