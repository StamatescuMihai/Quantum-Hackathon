import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, ChevronRight, Home } from 'lucide-react';

const lessons = [
  {
    id: '1.1',
    title: 'What is Quantum Computing?',
    number: '1.1',
    description: 'Introduction to quantum computing fundamentals'
  },
  {
    id: '1.2',
    title: 'Qubits and Superposition',
    number: '1.2',
    description: 'Understanding quantum bits and superposition'
  },
  {
    id: '1.3',
    title: 'Quantum Computers-Qubits',
    number: '1.3',
    description: 'Basic quantum computers and qubits'
  },
  {
    id: '1.4',
    title: 'Quantum Computing Use-Cases',
    number: '1.4',
    description: 'Examples of how Quantum Computing is used'
  },
  {
    id: '1.5',
    title: 'Quantum Utility Advantage',
    number: '1.5',
    description: 'The advantages of Quantum'
  },
];

const Navbar_course_intro = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border-r border-blue-400/20">
      {/* Header Section */}
      <div className="p-6 border-b border-blue-400/20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Quantum Computing</h2>
              <p className="text-blue-300 text-sm">Introduction Course</p>
            </div>
          </div>
          <button
            className="md:hidden text-white hover:text-blue-300 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-blue-300 space-x-2">
          <Link to="/" className="hover:text-white transition-colors flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/courses" className="hover:text-white transition-colors">
            Courses
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Quantum Intro</span>
        </div>
      </div>

      {/* Lessons List */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block p-4`}>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide mb-3">
            Course Content
          </h3>
        </div>

        <ul className="space-y-2">
          {lessons.map((lesson, index) => {
            const isActive = location.pathname.endsWith(lesson.id);
            
            return (
              <li key={lesson.id}>
                <Link
                  to={`/courses/intro/${lesson.id}`}
                  className={`group block p-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-lg shadow-blue-500/10'
                      : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Lesson number badge */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white' 
                        : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                    }`}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${
                          isActive ? 'text-blue-300' : 'text-slate-400'
                        }`}>
                          {lesson.number}
                        </span>
                        {isActive && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      
                      <h4 className={`font-semibold text-sm mb-1 leading-tight ${
                        isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}>
                        {lesson.title}
                      </h4>
                      
                      <p className={`text-xs leading-relaxed ${
                        isActive ? 'text-blue-200' : 'text-slate-400 group-hover:text-slate-300'
                      }`}>
                        {lesson.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar_course_intro;