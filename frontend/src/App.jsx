import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Algorithms from './pages/Algorithms'
import Grover from './pages/Grover'
import DeutschJozsa from './pages/DeutschJozsa'
import Simulator from './pages/Simulator'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/algorithms/grover" element={<Grover />} />
            <Route path="/algorithms/deutsch-jozsa" element={<DeutschJozsa />} />
            <Route path="/simulator" element={<Simulator />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
