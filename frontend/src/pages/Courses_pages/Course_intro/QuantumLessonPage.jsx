import { useParams } from 'react-router-dom'
import Lesson1 from './lessons/Lesson1'


const QuantumIntroLessonPage = () => {
  const { lessonId } = useParams()

  const lessons = {
    '1.0.1': <Lesson1 />,
  }

  return lessons[lessonId] || <div className="text-white">Lesson not found</div>
}

export default QuantumIntroLessonPage