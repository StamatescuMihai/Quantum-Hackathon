import React, { useEffect } from 'react';
import Navbar_course_intro from '../../../components/Navbar_course_intro';
import { Outlet } from 'react-router-dom';

const Courses_intro = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      {/* Left Sidebar: Navigation */}
      <div className="w-full md:w-1/4 xl:w-1/5 border-r border-white/10 bg-black/20 backdrop-blur-lg">
        <Navbar_course_intro />
      </div>

      {/* Right Content: Lesson Area */}
      <div className="w-full md:w-3/4 xl:w-4/5 p-6 overflow-y-auto max-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Courses_intro;
