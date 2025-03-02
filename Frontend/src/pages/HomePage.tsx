import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Download, MessageSquare, HelpCircle, BookOpen, Users } from 'lucide-react';
import AskAISection from '../components/AskAISection';
import PostDoubtSection from '../components/PostDoubtSection';

// Adding global styles using a regular style tag in the component
const GlobalStyles = () => (
  <style>
    {`
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      .appear {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `}
  </style>
);

const HomePage: React.FC = () => {
  // Animation effect on component mount
  useEffect(() => {
    const sections = document.querySelectorAll('.animate-section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="space-y-12 py-6 max-w-6xl mx-auto px-4">
      {/* Add global styles */}
      <GlobalStyles />
      
      {/* Hero section */}
      <section className="animate-section opacity-0 transition-all duration-700 transform translate-y-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-10 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Study Smarter, Together</h1>
          <p className="text-xl opacity-90 mb-8">Your one-stop platform for sharing resources, getting AI help, and connecting with peers</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Get Started
            </Link>
            <Link type='blank' to="https://github.com/Medhansh-32/paperpal" className="bg-indigo-800 bg-opacity-40 hover:bg-opacity-60 border border-indigo-400 font-semibold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-1">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Study Material Section */}
      <section className="animate-section opacity-0 transition-all duration-700 transform translate-y-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
            <span>Study Material</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              to="/upload-material"
              className="group flex flex-col items-center justify-center p-8 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-md transition-all duration-300"
            >
              <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-10 w-10 text-white" />
              </div>
              <span className="text-xl font-semibold text-white mb-2">Upload Material</span>
              <p className="text-indigo-100 text-center">Share notes, previous year questions, and study resources</p>
              <div className="mt-4 w-10 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              to="/download-material"
              className="group flex flex-col items-center justify-center p-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md transition-all duration-300"
            >
              <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Download className="h-10 w-10 text-white" />
              </div>
              <span className="text-xl font-semibold text-white mb-2">Download Material</span>
              <p className="text-purple-100 text-center">Access study materials shared by other students</p>
              <div className="mt-4 w-10 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
        
        {/* Featured resources */}
        <div className="bg-gray-50 p-6 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Popular Resources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['PYQs', 'Notes', 'Assignments','Query-Solve'].map((resource, index) => (
              <div key={index} className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center cursor-pointer">
                <p className="text-indigo-600 font-medium">{resource}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Ask AI Section */}
      <section className="animate-section opacity-0 transition-all duration-700 transform translate-y-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <MessageSquare className="h-6 w-6 text-indigo-600 mr-2" />
            <span>Ask AI</span>
          </h2>
          <AskAISection />
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <p className="font-medium">Get instant answers to your academic questions</p>
            <div className="animate-bounce">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Post Doubt Section */}
      <section className="animate-section opacity-0 transition-all duration-700 transform translate-y-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <HelpCircle className="h-6 w-6 text-indigo-600 mr-2" />
            <span>Post a Doubt</span>
          </h2>
          <PostDoubtSection />
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <p className="font-medium">Connect with peers who can help solve your problems</p>
            <div className="animate-pulse">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>
      <section className="animate-section opacity-0 transition-all duration-700 transform translate-y-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Study Materials</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Question Banks</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Video Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">Community</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Forums</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Study Groups</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Feedback</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-3">Account</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Login</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Register</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Profile</a></li>
              </ul>
            </div>
          </div>
        </section>
    </div>
  );
};

export default HomePage;