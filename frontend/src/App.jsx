import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Planets from "./pages/Planets";
import Space3D from "./pages/Space3D";
import PlanetDetails from './pages/PlanetDetails';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import SolarSystem from './components/SolarSystem';
import Missions from './pages/Missions';
import MissionDetail from './pages/MissionDetails';
import AsteroidTracking from './pages/AsteroidTracking';
import Explore from './components/Explore';
import { useAuthStore } from './store/useAuthStore';
import SignupPage from './pages/SignUp';
import LoginPage from './pages/LoginPage';

const queryClient = new QueryClient()

function App() {
  const {authUser, checkAuth} = useAuthStore()
  useEffect(()=>{
    checkAuth()
  }, [checkAuth])
  console.log(authUser);
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <Router>
    {!(window.location.pathname.includes("/signup") || window.location.pathname.includes("/login")) && <Navbar />}
    <AnimatePresence mode='wait'>
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planets" element={<Planets />} />
        <Route path='/planets/:id' element={<PlanetDetails/>}/>
        <Route path="/missions" element={<Missions />} />
        <Route path="/missions/:id" element={<MissionDetail />} />
        <Route path="/space-3d" element={<Space3D />} />
        <Route path="/solar-system-3d" element={<SolarSystem />} />
        <Route path="/asteroids" element={<AsteroidTracking/>}/>
        <Route path="/explore" element={<Explore />}/>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes> */}
      <MainContent/>
      </AnimatePresence>
    </Router>
    </ThemeProvider>
    </QueryClientProvider>
  );
}
const MainContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/signup", "/login"];
  const {authUser}  = useAuthStore();
  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <AnimatePresence mode='wait'>
        <Routes>
          <Route path="/"  element={ <Home />}   />
          <Route path="/planets" element={ authUser ? <Planets /> : <LoginPage/> }   />
          <Route path='/planets/:id' element={ authUser ? <PlanetDetails /> : <LoginPage/> }   />
          <Route path="/missions" element={ authUser ? <Missions /> : <LoginPage/> }   />
          <Route path="/missions/:id" element={ authUser ? <MissionDetail /> : <LoginPage/> }   />
          <Route path="/space-3d" element={ authUser ? <Space3D /> : <LoginPage/> }   />
          <Route path="/solar-system-3d" element={ authUser ? <SolarSystem /> : <LoginPage/> }   />
          <Route path="/asteroids" element={ authUser ? <AsteroidTracking /> : <LoginPage/> }   />
          <Route path="/explore" element={ authUser ? <Explore /> : <LoginPage/> }   />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
export default App;

