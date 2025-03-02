import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Github, LogOut, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-900 dark:to-gray-800 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Mobile Hamburger */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-12 w-12 text-white transition-all duration-300 transform hover:scale-110" />
              <span className="text-3xl font-extrabold text-white transition-colors duration-300">PaperPal</span>
            </Link>
          </div>
          
          {/* Desktop Links and GitHub button */}
          <div className="hidden lg:flex items-center space-x-10">
            <a
              href="https://github.com/Medhansh-32/paperpal"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
              aria-label="GitHub repository"
            >
              <Github className="h-8 w-8" />
            </a>
            
            <button
              onClick={handleLogout}
              className="flex items-center px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <LogOut className="h-6 w-6 mr-3" />
              Logout
            </button>
          </div>

          {/* Hamburger Menu for mobile */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden flex flex-col space-y-4 py-4 mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-900 dark:to-gray-800 text-white">
            <a
              href="https://github.com/Medhansh-32/paperpal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <Github className="h-8 w-8 mr-3" />
              GitHub Repo
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <LogOut className="h-6 w-6 mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
