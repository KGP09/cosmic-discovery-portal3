
import { useQuery } from '@tanstack/react-query';
import { fetchMissions } from '../services/nasaApi';
import LoadingSpinner from '../components/LoadingSpinner';
import GlassCard from '../components/GlassCard';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Target, Check, X, Clock } from 'lucide-react';
import BackgroundStars from '../components/BackgroundStars';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../components/ui/Button';
import Input from '../components/ui/input';
import { useToast } from '../hooks/use-toast';


const Missions = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const { toast } = useToast();
  const observerTarget = useRef(null);
  
  // Extract search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);
  }, [location.search]);
  
  const { data: missions, isLoading, isError } = useQuery({
    queryKey: ['missions'],
    queryFn: fetchMissions,
  });

  // Filter missions based on status and search query
  const filteredMissions = missions?.filter(mission => {
    // Status filter
    const statusMatch = statusFilter === 'all' || 
                       mission.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = !searchQuery || 
                       mission.name.toLowerCase().includes(searchLower) ||
                       mission.description.toLowerCase().includes(searchLower) ||
                       mission.target.toLowerCase().includes(searchLower);
    
    return statusMatch && searchMatch;
  });

  // Update hasMore based on filtered missions count
  useEffect(() => {
    if (filteredMissions) {
      setHasMore(displayCount < filteredMissions.length);
    }
  }, [filteredMissions, displayCount]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, filteredMissions]);

  const loadMore = useCallback(() => {
    setDisplayCount(prev => {
      const newCount = prev + 6;
      if (filteredMissions && newCount >= filteredMissions.length) {
        toast({
          title: "All missions loaded",
          description: `Showing all ${filteredMissions.length} available missions`,
          duration: 3000,
        });
      }
      return newCount;
    });
  }, [filteredMissions, toast]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-500" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-500" />;
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
      <div className="px-4 mx-auto max-w-6xl">
        {/* Header section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl text-white font-display mb-4">SpaceX Missions</h1>
          <p className="text-lg text-gray-400 text-muted-foreground max-w-2xl mx-auto">
            Explore SpaceX's rocket launches, from historic milestones to upcoming missions.
          </p>
        </motion.div>

        {/* Search and filter controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row justify-between gap-4"
        >
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder="Search missions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-white bg-gray-900 border-gray-700"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 text-muted-foreground">Filter by status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900 text-white border border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Missions</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </motion.div>

        {/* Total count display */}
        {filteredMissions && (
          <div className="mb-6 text-gray-400 text-sm text-muted-foreground">
            Showing {Math.min(displayCount, filteredMissions.length)} of {filteredMissions.length} missions
          </div>
        )}

        {/* Missions grid */}
        {isLoading && displayCount === 6 ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : isError ? (
          <GlassCard className="text-center py-12">
            <p className="text-destructive mb-4">Failed to load missions data</p>
            <Button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try Again
            </Button>
          </GlassCard>
        ) : (
          <>
            {filteredMissions?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No missions match your search criteria.</p>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMissions?.slice(0, displayCount).map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.1 + (index % 6) * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    <Link to={`/missions/${mission.id}`}>
                      <GlassCard hoverable className="h-full">
                        <div className="relative mb-4 overflow-hidden rounded-lg">
                          <img 
                            src={mission.imageUrl}
                            alt={mission.name}
                            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <div className="absolute top-2 right-2">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                getStatusClass(mission.status)
                              }`}
                            >
                              {getStatusIcon(mission.status)}
                              {mission.status}
                            </span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <h3 className="text-white text-xl font-bold">{mission.name}</h3>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-300 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(mission.startDate)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-300 text-muted-foreground">
                            <Target className="h-4 w-4" />
                            <span>{mission.target}</span>
                          </div>
                          
                          <p className="text-md text-amber-50 line-clamp-2 mt-2">
                            {mission.description}
                          </p>
                          
                          <div className="pt-2 flex justify-end">
                            <div className="inline-flex items-center gap-1 text-blue-500 hover:underline text-sm">
                              View Details <ArrowRight className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Intersection observer target for infinite scrolling */}
            {hasMore && (
              <div 
                ref={observerTarget}
                className="flex justify-center items-center py-8"
              >
                {isLoading && <LoadingSpinner size="md" />}
              </div>
            )}
            
            {/* "Load More" button as fallback */}
            {hasMore && filteredMissions && filteredMissions.length > displayCount && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : null}
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Missions;