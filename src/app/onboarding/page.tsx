'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { useStorage } from '@/lib/storage'

export default function Onboarding() {
  const router = useRouter()
  const { setNickname, setDailyGoal } = useStorage()
  const [nickname, setNicknameInput] = useState('')
  const [dailyGoal, setDailyGoalInput] = useState(10)
  const [step, setStep] = useState(1)

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nickname.trim()) {
      setNickname(nickname.trim())
      setStep(2)
    }
  }

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDailyGoal(dailyGoal)
    router.push('/')
  }

  const handleSkip = () => {
    setDailyGoal(10) // Default
    router.push('/')
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Step 1: Nickname */}
        {step === 1 && (
          <Card>
            <div className="text-center space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Benvenuto in LazyWalker! 🚶‍♀️
                </h1>
                <p className="text-gray-600">
                  Ti aiuteremo a fare movimento leggero ogni giorno con la tecnica Japanese Walking
                </p>
              </div>

              <form onSubmit={handleNicknameSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                    Come ti chiami?
                  </label>
                  <input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    placeholder="Il tuo nickname"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    maxLength={20}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={!nickname.trim()}
                >
                  Continua
                </Button>
              </form>
            </div>
          </Card>
        )}

        {/* Step 2: Obiettivo giornaliero */}
        {step === 2 && (
          <Card>
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Obiettivo giornaliero 🎯
                </h2>
                <p className="text-gray-600">
                  Quanti minuti di camminata vuoi fare ogni giorno?
                </p>
              </div>

              <form onSubmit={handleGoalSubmit} className="space-y-4">
                <div className="space-y-3">
                  {[5, 10, 15, 20].map((goal) => (
                    <label
                      key={goal}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        dailyGoal === goal
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={goal}
                        checked={dailyGoal === goal}
                        onChange={(e) => setDailyGoalInput(Number(e.target.value))}
                        className="sr-only"
                      />
                      <div className="font-semibold text-gray-800">
                        {goal} minuti
                      </div>
                      <div className="text-sm text-gray-600">
                        {goal <= 10 ? 'Perfetto per iniziare' : 'Per chi vuole di più'}
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={handleSkip}
                    className="flex-1 btn-secondary"
                  >
                    Salta
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    Inizia!
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Info sulla tecnica */}
        <Card>
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-gray-800">
              Cos&apos;è il Japanese Walking? 🇯🇵
            </h3>
            <p className="text-sm text-gray-600">
              Una tecnica di camminata lenta e consapevole, perfetta per chi vuole iniziare a muoversi senza sforzi eccessivi.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
