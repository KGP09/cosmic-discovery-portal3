import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stars, setStars] = useState([]);
  const{signup} = useAuthStore()
  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * 2 + 1
    }));
    setStars(newStars);
    }, []);
    const navigate = useNavigate()
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Signup submitted:', { username,  email, password });
      if(signup({fullName : username , email, password}))     navigate('/')
    };
    return (
      <div className="min-h-screen flex">
        {/* Left Side - CosmicExplorer Intro */}
        <div className="w-1/2 flex flex-col justify-center items-center bg-black text-white relative overflow-hidden">
          {/* Random Stars Background */}
          <div className="absolute inset-0">
            {stars.map((star) => (
              <div
                key={star.id}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  opacity: star.opacity,
                  animation: `twinkle ${star.twinkle}s ease-in-out infinite alternate`
                }}
              ></div>
            ))}
          </div>

          {/* Branding & Text */}
          <h1 className="text-4xl font-bold">
            <span className="text-white">Cosmic</span>
            <span className="text-blue-400">Explorer</span>
          </h1>
          <p className="text-gray-400 text-lg text-center max-w-lg mt-4">
            Explore the Universe.
          </p>

          {/* Planets & Glow Effects */}
          <div className="absolute">
            <div className="w-16 h-16 bg-yellow-500 rounded-full absolute left-24 top-16 opacity-80 blur-lg"></div>
            <div className="w-6 h-6 bg-red-500 rounded-full absolute right-24 bottom-32"></div>
            <div className="w-8 h-8 bg-blue-500 rounded-full absolute bottom-20 left-12"></div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-1/2 flex justify-center items-center bg-black text-white relative">
          {/* Random Stars Background */}
          <div className="absolute inset-0">
            {stars.map((star) => (
              <div
                key={star.id}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  opacity: star.opacity,
                  animation: `twinkle ${star.twinkle}s ease-in-out infinite alternate`
                }}
              ></div>
            ))}
          </div>

          <div className="max-w-md w-full p-8 rounded-lg bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm border border-blue-900 border-opacity-30 shadow-lg z-10">
            <h1 className="text-3xl font-bold text-center">
              <span className="text-white">Cosmic</span>
              <span className="text-blue-400"> Discovery</span>
            </h1>

            <h2 className="text-2xl font-bold text-center mt-2 mb-6">
              Join <span className="text-blue-400">Cosmos</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-white"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium text-white transition duration-200"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?
                <Link className="underline" to="/login">
                  <span className="text-white"> Log in</span>
                </Link>
              </p>
            </div>
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>© 2025 Cosmic Explorer. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default SignUpPage;
