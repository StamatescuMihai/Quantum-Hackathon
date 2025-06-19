import { useParams } from 'react-router-dom'
import Lesson1 from './lessons/Lesson1'
import Lesson2 from './lessons/Lesson2'
import Lesson3 from './lessons/Lesson3'
import Lesson4 from './lessons/Lesson4'
import Lesson5 from './lessons/Lesson5'


const QuantumIntroLessonPage = () => {
  const { lessonId } = useParams()

  const lessons = {
    '1.1': <Lesson1 />,
    '1.2': <Lesson2 />,
    '1.3': <Lesson3 />,
    '1.4': <Lesson4 />,
    '1.5': <Lesson5 />,
  }

  return lessons[lessonId] || <div className="text-white">Lesson not found</div>
}

export default QuantumIntroLessonPage