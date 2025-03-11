import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Planets from "./pages/Planets";
import Space3D from "./pages/Space3D";
import PlanetDetails from './pages/PlanetDetails';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <Router>
      <Navbar />
      <AnimatePresence mode='wait'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planets" element={<Planets />} />
        <Route path='/planets/:id' element={<PlanetDetails/>}/>
        {/* <Route path="/missions" element={<Missions />} /> */}
        <Route path="/space-3d" element={<Space3D />} />
      </Routes>
      </AnimatePresence>
    </Router>
    </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

