import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMissionDetails } from '../services/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';
import BackgroundStars from '../components/BackgroundStars';
import { ArrowLeft, Calendar, Target, Rocket, Check, X, Clock, Link2, Globe, Youtube } from 'lucide-react';

const MissionDetail = () => {
  const { id } = useParams();
  
  const { data: mission, isLoading, isError } = useQuery({
    queryKey: ['mission', id],
    queryFn: () => fetchMissionDetails(id || ''),
    enabled: !!id,
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <X className="h-5 w-5 text-red-500" />;
      case 'upcoming':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return 'bg-green-500/20 text-green-500 border border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-500 border border-red-500/30';
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-500 border border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border border-gray-500/30';
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-4">
      <BackgroundStars />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link to="/missions" className="inline-flex items-center gap-2 text-gray-400 text-muted-foreground hover:text-blue-500 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Missions
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : isError ? (
          <GlassCard className="text-center py-12">
            <p className="text-destructive mb-4">Failed to load mission data</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-md bg-blue-500 text-primary-foreground hover:bg-blue-500/90 transition-colors"
            >
              Try Again
            </button>
          </GlassCard>
        ) : mission ? (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl text-white font-display">{mission.name}</h1>
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                    getStatusClass(mission.status)
                  }`}
                >
                  {getStatusIcon(mission.status)}
                  {mission.status}
                </span>
              </div>
              {mission.flight_number && (
                <p className="text-lg text-gray-400 text-muted-foreground">
                  Flight #{mission.flight_number}
                </p>
              )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Mission image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <GlassCard className="p-0 overflow-hidden">
                  <img 
                    src={mission.imageUrl}
                    alt={mission.name}
                    className="w-full h-auto object-cover"
                  />
                </GlassCard>
              </motion.div>

              {/* Mission details */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <GlassCard>
                  <h2 className="text-xl text-amber-50 font-bold mb-6">Mission Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="border border-border bg-background/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <Calendar className="h-5 w-5" />
                        <span className="text-sm font-medium">Launch Date</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {formatDate(mission.startDate)}
                      </div>
                    </div>

                    {mission.rocket && (
                      <div className="border border-border bg-background/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                          <Rocket className="h-5 w-5" />
                          <span className="text-sm font-medium">Rocket</span>
                        </div>
                        <div className="text-lg font-semibold">
                          {mission.rocket.name}
                        </div>
                      </div>
                    )}

                    <div className="border border-border bg-background/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <Target className="h-5 w-5" />
                        <span className="text-sm font-medium">Target</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {mission.target}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">
                        {mission.description || "No description available for this mission."}
                      </p>
                    </div>
                    
                    {mission.links && Object.values(mission.links).some(value => value) && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Resources</h3>
                        <div className="flex flex-wrap gap-3">
                          {mission.links.webcast && (
                            <a 
                              href={mission.links.webcast} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm hover:bg-secondary/80 transition-colors"
                            >
                              <Youtube className="h-4 w-4" />
                              Watch Webcast
                            </a>
                          )}
                          {mission.links.article && (
                            <a 
                              href={mission.links.article} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm hover:bg-secondary/80 transition-colors"
                            >
                              <Link2 className="h-4 w-4" />
                              Read Article
                            </a>
                          )}
                          {mission.links.wikipedia && (
                            <a 
                              href={mission.links.wikipedia} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm hover:bg-secondary/80 transition-colors"
                            >
                              <Globe className="h-4 w-4" />
                              Wikipedia
                            </a>
                          )}
                        </div>
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

export default MissionDetail;