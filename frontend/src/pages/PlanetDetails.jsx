import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPlanetDetails } from '../services/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import BackgroundStars from '../components/BackgroundStars';
import { ArrowLeft, Globe, Thermometer, Calendar, Ruler, Waves, Scale } from 'lucide-react';

// Updated planet images with more distinctive and accurate representations
const planetImages = {
  'mercury': 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&fit=crop',
  'venus': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&fit=crop', 
  'earth': 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&fit=crop',
  'mars': 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=800&fit=crop',
  'jupiter': 'https://images.unsplash.com/photo-1630839437035-dac17da580d0?w=800&fit=crop',
  'saturn': 'https://images.unsplash.com/photo-1614314107768-6018061e5444?w=800&fit=crop',
  'uranus': 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&fit=crop',
  'neptune': 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=800&fit=crop',
};

// Function to format scientific notation values
const formatScientificValue = (value, exponent, unit) => {
  if (exponent === 0) return `${value} ${unit}`;
  return `${value} × 10^${exponent} ${unit}`;
};

const PlanetDetails = () => {
  const { id } = useParams();
  
  const { data: planet, isLoading, isError } = useQuery({
    queryKey: ['planet', id],
    queryFn: () => fetchPlanetDetails(id || ''),
    enabled: !!id,
  });

  // Stats for the info boxes
  const planetStats = planet ? [
    { 
      icon: <Globe className="h-5 w-5" />,
      label: 'Diameter', 
      value: `${(planet.meanRadius * 2).toLocaleString()} km` 
    },
    { 
      icon: <Scale className="h-5 w-5" />,
      label: 'Mass', 
      value: formatScientificValue(planet.mass.massValue, planet.mass.massExponent, 'kg')
    },
    { 
      icon: <Calendar className="h-5 w-5" />,
      label: 'Orbit Period', 
      value: `${planet.sideralOrbit.toFixed(1)} days` 
    },
    { 
      icon: <Ruler className="h-5 w-5" />,
      label: 'Distance from Sun', 
      value: `${(planet.semimajorAxis / 149597870.7).toFixed(2)} AU` 
    },
    { 
      icon: <Thermometer className="h-5 w-5" />,
      label: 'Average Temperature', 
      value: `${planet.avgTemp} K` 
    },
    { 
      icon: <Waves className="h-5 w-5" />,
      label: 'Gravity', 
      value: `${planet.gravity} m/s²` 
    },
  ] : [];

  return (
    <div className="relative min-h-screen bg-space-gradient pt-24 pb-16 px-4">
      <BackgroundStars />
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link to="/planets" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Planets
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : isError ? (
          <GlassCard className="text-center py-12">
            <p className="text-destructive mb-4">Failed to load planet data</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </GlassCard>
        ) : planet ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-display mb-2">{planet.englishName}</h1>
              <p className="text-lg text-muted-foreground">
                {planet.bodyType.charAt(0).toUpperCase() + planet.bodyType.slice(1)}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Planet image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <GlassCard className="p-0 overflow-hidden">
                  <img 
                    src={planetImages[planet.id.toLowerCase()] || `https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&fit=crop`}
                    alt={planet.englishName}
                    className="w-full h-auto aspect-square object-cover"
                  />
                </GlassCard>
              </motion.div>

              {/* Planet stats */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <GlassCard>
                  <h2 className="text-xl font-bold mb-6">Planet Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {planetStats.map((stat, index) => (
                      <div 
                        key={index} 
                        className="border border-border bg-background/30 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-2 mb-2 text-primary">
                          {stat.icon}
                          <span className="text-sm font-medium">{stat.label}</span>
                        </div>
                        <div className="text-lg font-semibold">
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    {planet.moons && planet.moons.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Moons</h3>
                        <p className="text-muted-foreground mb-2">
                          {planet.englishName} has {planet.moons.length} {planet.moons.length === 1 ? 'moon' : 'moons'}.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {planet.moons.slice(0, 12).map((moon, index) => (
                            <span 
                              key={index} 
                              className="bg-secondary px-3 py-1 rounded-full text-sm"
                            >
                              {moon.moon.replace(` ${planet.id}`, '')}
                            </span>
                          ))}
                          {planet.moons.length > 12 && (
                            <span className="bg-secondary px-3 py-1 rounded-full text-sm">
                              +{planet.moons.length - 12} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Discovery</h3>
                      {planet.discoveredBy ? (
                        <p className="text-muted-foreground">
                          Discovered by {planet.discoveredBy} {planet.discoveryDate && `on ${planet.discoveryDate}`}.
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          Known since ancient times.
                        </p>
                      )}
                    </div>
                    
                    {planet.alternativeName && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Alternative Names</h3>
                        <p className="text-muted-foreground">{planet.alternativeName}</p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PlanetDetails;
