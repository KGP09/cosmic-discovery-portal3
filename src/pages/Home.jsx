import { useState, useEffect } from "react";
import { Globe, Rocket, RefreshCw, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundStars from "../components/BackgroundStars";
import { fetchApod } from "../services/nasaApi";
import LoadingSpinner from "../components/LoadingSpinner";
import GlassCard from "../components/GlassCard";

const Home = () => {
  const [apod, setApod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const getApod = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApod();
      setApod(data);
      setIsError(false);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getApod();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundStars />
      <section className="flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-display tracking-tight mb-6">
            <span className="text-white">Explore The</span> <span className="text-blue-900">Cosmos</span>
          </h1>
          <p className="text-lg text-gray-400 md:text-xl mb-8 leading-relaxed">
            Embark on a journey through space with NASA's data, discovering planets,
            missions, and the wonders of our universe.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="text-white bg-blue-600 hover:bg-blue-600/90 rounded-full gap-2 px-6">
              <Link to="/planets">
                <Globe className="h-5 w-5" />
                Explore Planets
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-amber-50 bg-background border rounded-full gap-2 px-6 hover:bg-amber-50/10 hover:border-primary transition-all duration-200">
              <Link to="/missions">
                <Rocket className="h-5 w-5" />
                Discover Missions
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-5xl mt-6"
        >
          <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-3xl text-white font-display">Astronomy Picture of the Day</h2>
            <button
              onClick={getApod}
              disabled={isLoading}
              className="gap-2 bg-transparent text-gray-700 hover:text-gray-900 px-3 py-1 rounded flex items-center"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <GlassCard className="overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner size="lg" />
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">
                  Failed to load the astronomy picture
                </p>
                <button onClick={getApod} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Try Again
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 relative rounded-lg overflow-hidden">
                  {apod?.media_type === "image" ? (
                    <img
                      src={apod.url}
                      alt={apod.title}
                      className="w-full h-full object-cover aspect-video md:aspect-auto"
                      style={{ maxHeight: "400px" }}
                    />
                  ) : (
                    <iframe
                      src={apod?.url}
                      title={apod?.title || "APOD Video"}
                      className="w-full aspect-video"
                      allowFullScreen
                      style={{ maxHeight: "400px" }}
                    />
                  )}
                </div>
                <div className="md:w-1/2 flex flex-col">
                  <h3 className="text-xl text-white font-bold mb-2">{apod?.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {new Date(apod?.date || "").toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {apod?.copyright && ` • ${apod.copyright}`}
                  </p>
                  <p className="text-sm text-white leading-relaxed overflow-y-auto max-h-[250px] pr-2">
                    {apod?.explanation}
                  </p>
                  {apod?.hdurl && (
                    <a
                      href={apod.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-auto pt-4 inline-flex items-center gap-1 text-sm"
                    >
                      View High Resolution <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
