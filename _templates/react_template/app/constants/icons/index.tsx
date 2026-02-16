import { BookText, CirclePile, Gauge, Lightbulb, Zap } from 'lucide-react'

export const iconsDictionary = {
  circlePile: <CirclePile className="w-6 h-6" />,
  flowBreak: <Zap className="w-6 h-6" />,
  flowControl: <Gauge className="w-6 h-6" />,
  flowInsight: <Lightbulb className="w-6 h-6" />,
  bookText: <BookText className="w-6 h-6" />,
}

export type IconKeyType = keyof typeof iconsDictionary

export const getIconKeys = () => Object.keys(iconsDictionary)
