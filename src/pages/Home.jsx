import { Globe, Rocket } from "lucide-react";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BackgroundStars from "../components/BackgroundStars";

const Home = () => {
    return (
      <div className="relative min-h-screen flex flex-col">
        <BackgroundStars/>
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
      </section>
      </div>
    );
  };
  
  export default Home;  
  