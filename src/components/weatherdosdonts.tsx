import React from "react"
import { Card, CardContent } from "./ui/card"
import { CheckCircle, XCircle, Thermometer } from "lucide-react"
import type { WeatherData } from "@/api/types"

interface WeatherDosDontsProps {
  data: WeatherData
}

const WeatherDosDonts = ({ data }: WeatherDosDontsProps) => {
  const {
    main: { temp },
    weather: [currentWeather],
  } = data

  // 🌡️ Generate Do’s and Don’ts based on temperature
  const getTips = (temperature: number) => {
    if (temperature < 5) {
      return {
        dos: [
          "Wear multiple warm layers and a jacket 🧥",
          "Drink warm beverages ☕",
          "Keep your ears and hands covered 🧤",
        ],
        donts: ["Avoid staying outside for too long ❌", "Don’t forget gloves or a hat 🧢"],
      }
    } else if (temperature < 15) {
      return {
        dos: ["Wear a sweater or hoodie 🧣", "Carry a light jacket"],
        donts: ["Don’t underestimate the cold evenings ❌"],
      }
    } else if (temperature < 25) {
      return {
        dos: ["Enjoy outdoor activities 🌳", "Wear comfortable cotton clothes 👕"],
        donts: ["Avoid heavy layers or thick jackets ❌"],
      }
    } else if (temperature < 32) {
      return {
        dos: ["Stay hydrated 💧", "Use sunscreen if going out ☀️"],
        donts: ["Avoid outdoor work in the afternoon ❌", "Don’t wear dark or thick clothes"],
      }
    } else {
      return {
        dos: ["Drink plenty of water 💦", "Stay in shade or indoors 🏠"],
        donts: ["Avoid direct sun for long ❌", "Don’t skip sunscreen 🧴"],
      }
    }
  }

  const tips = getTips(temp)

  return (
    <Card className="mt-6">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-semibold">Do’s and Don’ts for {Math.round(temp)}°C</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" /> Do’s
            </h4>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-muted-foreground">
              {tips.dos.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold flex items-center gap-1 text-red-500">
              <XCircle className="w-4 h-4" /> Don’ts
            </h4>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-muted-foreground">
              {tips.donts.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeatherDosDonts
