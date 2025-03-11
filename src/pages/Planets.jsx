import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchPlanets } from '../services/nasaApi';
import BackgroundStars from '../components/BackgroundStars'; 
import LoadingSpinner from '../components/LoadingSpinner';
import GlassCard from '../components/GlassCard';
import { Info } from 'lucide-react';
import Input from '../components/ui/input';

const planetImages = {
  mercury: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=400&fit=crop',
  venus: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop',
  earth: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=400&fit=crop',
  mars: 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=400&h=400&fit=crop',
  jupiter: 'https://images.unsplash.com/photo-1630839437035-dac17da580d0?w=400&h=400&fit=crop',
  saturn: 'https://images.unsplash.com/photo-1614314107768-6018061e5444?w=400&h=400&fit=crop',
  uranus: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400&h=400&fit=crop',
  neptune: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=400&h=400&fit=crop',
};

const Planets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('name');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('search') || '');
  }, [location.search]);

  const { data: planets, isLoading, isError } = useQuery({
    queryKey: ['planets'],
    queryFn: fetchPlanets,
  });

  const filteredPlanets = planets?.filter(planet =>
    planet.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPlanets = filteredPlanets?.sort((a, b) => {
    switch (selectedSort) {
      case 'name': return a.englishName.localeCompare(b.englishName);
      case 'distance': return a.semimajorAxis - b.semimajorAxis;
      case 'size': return b.meanRadius - a.meanRadius;
      default: return 0;
    }
  });

  const formatDistanceFromSun = (distance) => {
    return `${(distance / 149597870.7).toFixed(2)} AU`;
  };

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-4">
      <BackgroundStars />
      <div className="max-w-6xl mx-auto px-4">
        
        <motion.h1 className="text-white text-4xl text-center md:text-6xl font-display" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Explore Our Solar System</motion.h1>
        <motion.p className="text-gray-400 text-lg text-center text-muted-foreground mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Discover the planets that orbit our Sun, from the rocky inner worlds to the gas giants of the outer system.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row justify-between gap-4"
        >
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder="Search planets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-gray-900 text-white border border-gray-400 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="distance">Distance from Sun</option>
              <option value="size">Size</option>
            </select>
          </div>
        </motion.div>


        {isLoading ? <LoadingSpinner /> : isError ? <p>Error loading planets</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPlanets?.map((planet) => (
              <motion.div key={planet.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Link to={`/planets/${planet.id}`}>
                  <GlassCard hoverable className="h-full">
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={planetImages[planet.id.toLowerCase()] || `https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=400&fit=crop`}
                        alt={planet.englishName}
                        className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <h3 className="text-white text-xl font-bold">{planet.englishName}</h3>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Distance from Sun:</span>
                        <span className="font-medium text-white">{formatDistanceFromSun(planet.semimajorAxis)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Diameter:</span>
                        <span className="font-medium text-white">{(planet.meanRadius * 2).toLocaleString()} km</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Orbit Period:</span>
                        <span className="font-medium text-white">{planet.sideralOrbit.toFixed(2)} days</span>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <div className="inline-flex items-center gap-1 text-blue-500 hover:underline text-sm">
                          <Info className="h-4 w-4" /> View Details
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Planets;
