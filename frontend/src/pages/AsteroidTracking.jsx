
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, addDays, isBefore } from 'date-fns';
import { CalendarIcon, AlertTriangle, Search, Info, Radar, Zap } from 'lucide-react';
import { fetchAsteroids } from '../services/nasaApi';
import PageTransition from '../components/PageTransition'
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Calendar } from '../components/ui/calender';
import GlassCard from '../components/GlassCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Badge } from '../components/ui/badge';
import Progress from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import {Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { fetchAsteroidDetails } from '../services/nasaApi';
import BackgroundStars from '../components/BackgroundStars';

const AsteroidTracking = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 7));
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  // Format dates for API call
  const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
  const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ['asteroids', formattedStartDate, formattedEndDate],
    queryFn: () => fetchAsteroids(formattedStartDate, formattedEndDate),
    enabled: !!startDate && !!endDate,
  });

  // Handle date selection
  const handleDateSelect = (date, type) => {
    if (type === 'start') {
      setStartDate(date);
      // If end date is before start date, adjust it
      if (date && endDate && isBefore(endDate, date)) {
        setEndDate(addDays(date, 7));
      }
    } else {
      setEndDate(date);
    }
  };

  // Flatten asteroid data for easier display
  const flattenedAsteroids = data 
    ? Object.entries(data.near_earth_objects).flatMap(([date, asteroids]) => 
      asteroids.map(asteroid => ({
        ...asteroid,
        close_approach_date: date
      }))
    ) 
    : [];

  // Select asteroid for detailed view
  const handleSelectAsteroid = (asteroid) => {
    setSelectedAsteroid(asteroid);
    toast({
      title: "Asteroid selected",
      description: `Viewing details for ${asteroid.name}`,
    });
  };

  // Count hazardous asteroids
  const hazardousCount = flattenedAsteroids.filter(
    asteroid => asteroid.is_potentially_hazardous_asteroid
  ).length;

  return (
    <PageTransition>
        <BackgroundStars/>
      <div className="mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-white text-4xl font-display mb-4">
            Near-Earth Asteroid Tracking
          </h1>
          <p className="text-gray-400 text-muted-foreground">
            Monitor asteroids approaching Earth in real-time using NASA's NeoWs (Near Earth Object Web Service).
            Track their trajectories, sizes, and potential hazard status.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <GlassCard>
              <h2 className="text-xl text-white font-bold mb-4 flex items-center">
                <Radar className="mr-2 h-5 w-5" />
                Track Asteroids
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-white w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => handleDateSelect(date, 'start')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-white w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => handleDateSelect(date, 'end')}
                        initialFocus
                        disabled={(date) => 
                          startDate ? isBefore(date, startDate) : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button 
                className="text-white w-full mb-4" 
                disabled={!startDate || !endDate || isLoading}
              >
                <Search className="text-white mr-2 h-4 w-4" />
                Search Asteroids
              </Button>

              {data && (
                <div className="grid grid-cols-2 gap-4 text-center ">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <div className="text-2xl text-white font-bold">{data.element_count}</div>
                    <div className="text-xs text-gray-400 ">Total Asteroids</div>
                  </div>
                  <div className="p-3 bg-red-700/10 rounded-lg">
                    <div className="text-2xl font-bold text-red-700">{hazardousCount}</div>
                    <div className="text-xs text-gray-400">Potentially Hazardous</div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2 text-amber-50">About this data</h3>
                <p className="text-xs text-gray-400 text-muted-foreground">
                  Data is provided by NASA's Near Earth Object Web Service (NeoWs), which tracks asteroids and their 
                  approaches to Earth. The API allows querying data up to 7 days at a time.
                </p>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-8 bg-blue-900/10">
            <Card className="bg-gray-900/80 backdrop-blur-md border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Near-Earth Objects</CardTitle>
                  <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value)} className="w-[240px]">
                    <TabsList className="grid w-full grid-cols-2 text-white">
                      <TabsTrigger value="list">List View</TabsTrigger>
                      <TabsTrigger value="chart">Chart View</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <CardDescription className="text-gray-400">
                  Displaying {flattenedAsteroids.length} asteroids approaching Earth between {startDate && format(startDate, 'MMM d, yyyy')} and {endDate && format(endDate, 'MMM d, yyyy')}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center p-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : error ? (
                  <div className="text-center p-8 text-red-700">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                    <p>Failed to load asteroid data. Please try again later.</p>
                  </div>
                ) : (
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value)}>
                    <TabsContent value="list" className="mt-0">
                      <div className="space-y-4 max-h-[600px] overflow-y-auto p-2">
                        {flattenedAsteroids.map((asteroid) => (
                          <div 
                            key={asteroid.id}
                            className={`p-4 rounded-lg border transition-colors text-amber-50 cursor-pointer ${
                              selectedAsteroid?.id === asteroid.id 
                                ? 'bg-blue-500/10 border-blue-500' 
                                : 'hover:bg-gray-400/10'
                            }`}
                            onClick={() => handleSelectAsteroid(asteroid)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold">{asteroid.name}</h3>
                              {asteroid.is_potentially_hazardous_asteroid && (
                                <Badge variant="destructive">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Hazardous
                                </Badge>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div className="text-gray-400">Close Approach:</div>
                              <div className='text-amber-50'>{asteroid.close_approach_data[0]?.close_approach_date}</div>
                              
                              <div className="text-gray-400">Velocity:</div>
                              <div className='text-amber-50'>{parseInt(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_hour).toLocaleString()} km/h</div>
                              
                              <div className="text-gray-400">Miss Distance:</div>
                              <div className='text-amber-50'>{parseInt(asteroid.close_approach_data[0]?.miss_distance.kilometers).toLocaleString()} km</div>
                              
                              <div className="text-gray-400">Estimated Diameter:</div>
                              <div className='text-amber-50'>
                                {asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(0)}-
                                {asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} m
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="chart" className="mt-0">
                      <div className="space-y-6 max-h-[600px] overflow-y-auto p-2">
                        <div>
                          <h3 className="text-sm text-amber-50 font-medium mb-2">Closest Approaches (Miss Distance in Lunar Units)</h3>
                          <div className="space-y-2 text-amber-50">
                            {flattenedAsteroids
                              .sort((a, b) => 
                                parseFloat(a.close_approach_data[0]?.miss_distance.lunar) - 
                                parseFloat(b.close_approach_data[0]?.miss_distance.lunar)
                              )
                              .slice(0, 10)
                              .map((asteroid) => {
                                const lunarDistance = parseFloat(asteroid.close_approach_data[0]?.miss_distance.lunar);
                                // Progress is inverse (closer = more filled)
                                const progressValue = 100 - Math.min(lunarDistance / 10, 100);
                                
                                return (
                                  <div key={asteroid.id} className="flex items-center gap-2">
                                    <div className="w-40 truncate" title={asteroid.name}>
                                      {asteroid.name}
                                    </div>
                                    <Progress value={progressValue} className="flex-1" />
                                    <div className="w-16 text-right text-sm">
                                      {lunarDistance.toFixed(1)} LD
                                    </div>
                                  </div>
                                );
                              })
                            }
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm text-amber-50 font-medium mb-2">Size Distribution (Estimated Diameter in Meters)</h3>
                          <div className="space-y-2">
                            {flattenedAsteroids
                              .sort((a, b) => 
                                b.estimated_diameter.meters.estimated_diameter_max - 
                                a.estimated_diameter.meters.estimated_diameter_max
                              )
                              .slice(0, 10)
                              .map((asteroid) => {
                                const diameter = asteroid.estimated_diameter.meters.estimated_diameter_max;
                                // Scale to percentage (assuming 1000m is 100%)
                                const progressValue = Math.min((diameter / 1000) * 100, 100);
                                
                                return (
                                  <div key={asteroid.id} className="flex items-center gap-2 text-amber-50">
                                    <div className="w-40 truncate" title={asteroid.name}>
                                      {asteroid.name}
                                    </div>
                                    <Progress value={progressValue} className="flex-1" />
                                    <div className="w-16 text-right text-sm">
                                      {diameter.toFixed(0)} m
                                    </div>
                                  </div>
                                );
                              })
                            }
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-400">
                  <Info className="h-4 w-4 inline-block mr-1" />
                  LD = Lunar Distance (~384,400 km)
                </div>
                {selectedAsteroid && (
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={selectedAsteroid.nasa_jpl_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View NASA JPL Details
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {selectedAsteroid && (
              <GlassCard className="mt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold flex items-center">
                      {selectedAsteroid.name}
                      {selectedAsteroid.is_potentially_hazardous_asteroid && (
                        <Badge variant="destructive" className="ml-2">
                          <Zap className="h-3 w-3 mr-1" />
                          Potentially Hazardous
                        </Badge>
                      )}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Absolute Magnitude: {selectedAsteroid.absolute_magnitude_h} H
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Physical Characteristics</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Diameter (min):</span>
                        <span>{selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} km</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Diameter (max):</span>
                        <span>{selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Diameter in meters:</span>
                        <span>
                          {selectedAsteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(0)}-
                          {selectedAsteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} m
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Closest Approach Data</h3>
                    {selectedAsteroid.close_approach_data.length > 0 ? (
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span>{selectedAsteroid.close_approach_data[0].close_approach_date_full}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Relative Velocity:</span>
                          <span>{parseInt(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()} km/h</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Miss Distance (Lunar):</span>
                          <span>{parseFloat(selectedAsteroid.close_approach_data[0].miss_distance.lunar).toFixed(2)} LD</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Miss Distance (km):</span>
                          <span>{parseInt(selectedAsteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Orbiting Body:</span>
                          <span>{selectedAsteroid.close_approach_data[0].orbiting_body}</span>
                        </li>
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No close approach data available</p>
                    )}
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AsteroidTracking;
