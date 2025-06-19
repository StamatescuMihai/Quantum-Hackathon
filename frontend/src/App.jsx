import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Algorithms from './pages/Algorithms'
import Grover from './pages/Grover'
import DeutschJozsa from './pages/DeutschJozsa'
import BernsteinVazirani from './pages/BernsteinVazirani'
import Simon from './pages/Simon'
import Shor from './pages/Shor'
import Simulator from './pages/Simulator'
import Exercises from './pages/Exercises'
import ExercisePage from './pages/ExercisePage'
import Courses from './pages/Courses'
import Courses_intro from './pages/Courses_pages/Course_intro/Courses_intro'
import QuantumIntroLessonPage from './pages/Courses_pages/Course_intro/QuantumLessonPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/algorithms/grover" element={<Grover />} />
            <Route path="/algorithms/deutsch-jozsa" element={<DeutschJozsa />} />
            <Route path="/algorithms/bernstein-vazirani" element={<BernsteinVazirani />} />
            <Route path="/algorithms/simon" element={<Simon />} />
            <Route path="/algorithms/shor" element={<Shor />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/intro" element={<Courses_intro />}>
              <Route path=":lessonId" element={<QuantumIntroLessonPage />} />
            </Route>
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/:exerciseId" element={<ExercisePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
