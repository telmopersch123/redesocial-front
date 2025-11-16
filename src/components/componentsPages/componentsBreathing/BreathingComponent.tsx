import { CircleX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useBreathing } from '../../../context/BreathingContext'

const BreathingComponent = () => {
  const { Open, setOpen, typeBreathing } = useBreathing()

  const sequence = ['Inspire', 'Segure', 'Expire', 'Segure']
  const [textRecomend, setTextRecomend] = useState('Inspire')
  const [currentStyle, setCurrentStyle] = useState('')
  const [animationPoints, setAnimationPoints] = useState('')

  let pointsTimer = 0
  let timer = 0
  let timerPoints = 0
  let durationMeditation = 0
  const animationText = () => {
    setCurrentStyle('')
    requestAnimationFrame(() => {
      setCurrentStyle('duration-1000 animate-in slide-in-from-bottom')
    })
  }

  const incrementPoints = (timerPoints: number) => {
    setAnimationPoints('')
    clearInterval(pointsTimer)
    pointsTimer = setInterval(() => {
      setAnimationPoints((prev) => (prev.length < 3 ? prev + '.' : prev))
    }, timerPoints)

    return () => {
      clearInterval(pointsTimer)
    }
  }

  let index = 0
  useEffect(() => {
    if (!Open) return

    if (typeBreathing.includes('4-4-4')) {
      timer = 4000
      timerPoints = 1000
      durationMeditation = 12000
    } else {
      timer = 10000
      timerPoints = 3000
      durationMeditation = 30000
    }

    setTimeout(() => {
      setOpen(false)
    }, durationMeditation)

    setTextRecomend(sequence[index])
    animationText()

    incrementPoints(timerPoints)
    const interval = setInterval(() => {
      index = (index + 1) % sequence.length

      setTextRecomend(sequence[index])
      animationText()
      incrementPoints(timerPoints)
    }, timer)

    return () => {
      clearInterval(pointsTimer)
      clearInterval(interval)
    }
  }, [Open])

  if (!Open) return null

  return (
    <div
      className={`fixed inset-0 z-50 ${typeBreathing === 'Respiração 4-4-4' ? 'bg-[#B6C4FF]' : 'bg-[#BFE3C0]'}`}
    >
      <div
        onClick={() => setOpen(false)}
        className="absolute right-12 top-10 cursor-pointer text-white hover:scale-105"
      >
        <CircleX
          style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' }}
          className="h-8 w-8"
        />
      </div>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-6">
        <p className="mb-2 rounded-md bg-white/15 p-1 text-2xl font-semibold text-white">
          {typeBreathing}
        </p>
        <div className="flex flex-col items-center">
          <div
            className={`${typeBreathing === 'Respiração 4-4-4' ? 'grow-smooth' : 'grow-smooth-long'} flex h-40 w-40 items-center justify-center rounded-full bg-white/50`}
          >
            <div
              className={`${typeBreathing === 'Respiração 4-4-4' ? 'grow-smooth' : 'grow-smooth-long'} h-20 w-20 rounded-full bg-white/75`}
            ></div>
          </div>
          <div className="mt-6 space-y-4">
            <p
              className={`text-center text-2xl font-semibold text-white ${currentStyle}`}
            >
              {textRecomend}
              {animationPoints}
            </p>
            <p className="text-md animate font-semibold text-white">
              Foque na sua respiração
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BreathingComponent
