"use client"
import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Toggle dark mode based on system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const openSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('animate-slide-in');
    }
  };

  const closeSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('animate-slide-in');
      sidebar.classList.add('-translate-x-full');
    }
  };

  const addHoverEffectToMenuItems = () => {
    const menuItems = document.querySelectorAll('.menu-item-hover');
    menuItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const svg = item.querySelector('svg');
        if (svg) {
          svg.classList.add('text-indigo-800', 'dark:text-white');
        }
      });
      item.addEventListener('mouseleave', () => {
        const svg = item.querySelector('svg');
        if (svg) {
          svg.classList.remove('text-indigo-800', 'dark:text-white');
        }
      });
    });
  };

  useEffect(() => {
    addHoverEffectToMenuItems();
  }, []);

  return (
    <div className={`bg-gradient-to-r from-indigo-800 to-blue-900 min-h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      <aside
        id="sidebar"
        className="bg-white dark:bg-gray-800 w-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out transform -translate-x-full"
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-indigo-800 dark:text-white">Dashboard</h1>
          <button aria-label='button' id="closeSidebar" className="text-gray-500 hover:text-indigo-800 dark:text-gray-400 dark:hover:text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4 space-y-2">
            <li className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors duration-300 menu-item-hover"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </a>
            </li>
            {/* Add more menu items here */}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <a
            href="#"
            className="flex items-center text-gray-700 dark:text-gray-200 hover:text-indigo-800 dark:hover:text-white transition-colors duration-300"
          >
            <img src="https://i.pravatar.cc/40?img=1" alt="User avatar" className="w-8 h-8 rounded-full mr-3" />
            <span className="font-medium">John Doe</span>
          </a>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <button aria-label='button' id="openSidebar" className="text-white hover:text-indigo-200 focus:outline-none mb-4" onClick={openSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Dashboard</h1>
        <p className="text-white">This is the main content area. The sidebar can be toggled using the menu button.</p>
      </main>
    </div>
  );
};

export default Dashboard;