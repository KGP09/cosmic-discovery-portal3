import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchPlanets } from '../services/nasaApi';
import BackgroundStars from '../components/BackgroundStars'; 
import LoadingSpinner from '../components/LoadingSpinner';
import GlassCard from '../components/GlassCard';
import { Info } from 'lucide-react';
import Input from '../components/ui/Input';

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

  return (
    <div className="relative min-h-screen bg-space-gradient pt-24 pb-16 px-4">
      <BackgroundStars />
      <div className="container mx-auto max-w-6xl">
        <motion.h1 className="text-white text-4xl text-center md:text-6xl font-display" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Explore Our Solar System</motion.h1>
        <motion.p className="text-gray-400 text-lg text-center text-muted-foreground mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Discover the planets that orbit our Sun, from the rocky inner worlds to the gas giants of the outer system.
        </motion.p>
        
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 md:gap-6">
            <Input
              className="text-gray-400 bg-background border border-gray-600 rounded-full gap-2 px-6 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out hover:bg-amber-50/10 hover:border-primary"
              type="text"
              placeholder="Search planets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="text-gray-600 bg-background border border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out hover:bg-amber-50/10"
            >
              <option value="name">Name</option>
              <option value="distance">Distance from Sun</option>
              <option value="size">Size</option>
            </select>
          </div>


        {isLoading ? <LoadingSpinner /> : isError ? <p>Error loading planets</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPlanets?.map((planet) => (
              <motion.div key={planet.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Link to={`/planets/${planet.id}`}>
                  <GlassCard className="h-full">
                    <img src={planetImages[planet.id.toLowerCase()] || 'default_image_url'} alt={planet.englishName} className="w-full h-48 object-cover" />
                    <h3 className="text-xl font-bold mt-4">{planet.englishName}</h3>
                    <p>Distance: {planet.semimajorAxis.toFixed(2)} km</p>
                    <p>Size: {planet.meanRadius.toFixed(2)} km</p>
                    <p>Orbit Period: {planet.sideralOrbit.toFixed(2)} days</p>
                    <div className="flex justify-end text-primary hover:underline text-sm">
                      <Info className="h-4 w-4" /> View Details
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
