import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';

const lessons = [
  {
    id: '1.0.1',
    title: '1.0.1 What is Quantum Computing?',
  },
  {
    id: '1.0.2',
    title: '1.0.2 Qubits and Superposition',
  },
  {
    id: '1.0.3',
    title: '1.0.3 Quantum Gates Overview',
  },
];

const Navbar_course_intro = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>Quantum Intro</span>
        </h2>
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <ul className="space-y-2">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                to={`/courses/intro/${lesson.id}`}
                className={`block px-4 py-2 rounded ${
                  location.pathname.endsWith(lesson.id)
                    ? 'bg-quantum-600 text-white'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar_course_intro;
