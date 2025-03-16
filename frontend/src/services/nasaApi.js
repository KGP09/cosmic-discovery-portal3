

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY; // Fetching API key from .env file
const N2YO_API_KEY = import.meta.env.VITE_N2YO_API_KEY; // Fetching N2YO API key from .env file

// Function to fetch Astronomy Picture of the Day (APOD)
const fetchApod = async () => {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch APOD data");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching APOD:", error);
    throw error;
  }
};

// Function to fetch planet details
const fetchPlanets = async () => {
  try {
    const response = await fetch(
      "https://api.le-systeme-solaire.net/rest/bodies?filter[]=isPlanet,eq,true"
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch planets data");
    }
    
    const data = await response.json();
    return data.bodies;
  } catch (error) {
    console.error("Error fetching planets:", error);
    throw error;
  }
};

// Function to fetch individual planet details
const fetchPlanetDetails = async (planetId) => {
  try {
    const response = await fetch(
      `https://api.le-systeme-solaire.net/rest/bodies/${planetId}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch details for planet: ${planetId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching planet ${planetId}:`, error);
    throw error;
  }
};

// Function to fetch SpaceX missions
const fetchMissions = async () => {
  try {
    const response = await fetch("https://api.spacexdata.com/v4/launches");
    
    if (!response.ok) {
      throw new Error("Failed to fetch missions data");
    }
    
    const data = await response.json();
    
    return data.map((launch) => ({
      id: launch.id,
      name: launch.name,
      description: launch.details || "No description available",
      status: launch.upcoming ? "Upcoming" : (launch.success ? "Successful" : "Failed"),
      startDate: launch.date_utc,
      target: launch.rocket ? "Space" : "Unknown",
      imageUrl: launch.links?.flickr?.original?.[0] || 
                launch.links?.patch?.large || 
                "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1470&auto=format&fit=crop",
      details: launch.details,
      success: launch.success,
      upcoming: launch.upcoming,
      flight_number: launch.flight_number,
      rocket: launch.rocket,
      links: launch.links
    }));
  } catch (error) {
    console.error("Error fetching missions:", error);
    throw error;
  }
};

export const fetchMissionDetails = async (missionId) => {
  try {
    const response = await fetch(`https://api.spacexdata.com/v4/launches/${missionId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch details for mission: ${missionId}`);
    }
    
    const launch = await response.json();
    
    return {
      id: launch.id,
      name: launch.name,
      description: launch.details || "No description available",
      status: launch.upcoming ? "Upcoming" : (launch.success ? "Successful" : "Failed"),
      startDate: launch.date_utc,
      endDate: undefined,
      target: launch.rocket ? "Space" : "Unknown",
      imageUrl: launch.links?.flickr?.original?.[0] || 
                launch.links?.patch?.large || 
                "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1470&auto=format&fit=crop",
      details: launch.details,
      success: launch.success,
      upcoming: launch.upcoming,
      flight_number: launch.flight_number,
      rocket: launch.rocket,
      links: launch.links
    };
  } catch (error) {
    console.error(`Error fetching mission ${missionId}:`, error);
    throw error;
  }
};

// Function to fetch satellite data
const fetchSatellites = async () => {
  try {
    const observerLat = 40.7128;
    const observerLng = -74.0060;
    const observerAlt = 0;
    const searchRadius = 90;
    const categoryId = 0; // All satellites

    const response = await fetch(
      `https://api.n2yo.com/rest/v1/satellite/above/${observerLat}/${observerLng}/${observerAlt}/${searchRadius}/${categoryId}?apiKey=${N2YO_API_KEY}`,
      {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch satellite data: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.info || !data.above) {
      throw new Error("Invalid satellite data format");
    }
    
    return data.above.map((sat) => ({
      satid: sat.satid,
      satname: sat.satname,
      intDesignator: sat.intDesignator || "Unknown",
      launchDate: sat.launchDate || "Unknown",
      satlat: sat.satlat,
      satlng: sat.satlng,
      satalt: sat.satalt,
      country: sat.country || "Unknown",
      velocity: sat.satvel || undefined,
      altitude: sat.satalt,
      direction: sat.azimuth || undefined,
      footprint: sat.footprint || undefined,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error("Error fetching satellites:", error);
    throw error;
  }
};

// Function to fetch details for a specific satellite
const fetchSatelliteDetail = async (satelliteId) => {
  try {
    const observerLat = 40.7128;
    const observerLng = -74.0060;
    const observerAlt = 0;
    const seconds = 300; // Get positions for the next 5 minutes

    const response = await fetch(
      `https://api.n2yo.com/rest/v1/satellite/positions/${satelliteId}/${observerLat}/${observerLng}/${observerAlt}/${seconds}?apiKey=${N2YO_API_KEY}`,
      {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch details for satellite: ${satelliteId}`);
    }
    
    const data = await response.json();
    
    if (!data.info || !data.positions || data.positions.length === 0) {
      throw new Error("Invalid satellite detail data format");
    }
    
    const position = data.positions[0];
    
    return {
      satid: data.info.satid,
      satname: data.info.satname,
      intDesignator: data.info.intDesignator || "Unknown",
      launchDate: data.info.launchDate || "Unknown",
      satlat: position.satlatitude,
      satlng: position.satlongitude,
      satalt: position.sataltitude,
      country: data.info.country || "Unknown",
      velocity: position.satvel || undefined,
      altitude: position.sataltitude,
      direction: position.azimuth || undefined,
      footprint: position.footprint || undefined,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(`Error fetching satellite ${satelliteId}:`, error);
    throw error;
  }
};

const fetchAsteroids = async (startDate, endDate) => {
  try {
    // If no dates are provided, use today and the next 7 days
    const start = startDate || new Date().toISOString().split("T")[0];
    let end = endDate;

    if (!end) {
      const endDateObj = new Date();
      endDateObj.setDate(endDateObj.getDate() + 7);
      end = endDateObj.toISOString().split("T")[0];
    }

    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${NASA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch asteroid data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching asteroids:", error);
    throw error;
  }
};

const fetchAsteroidDetails = async (asteroidId) => {
  try {
    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${NASA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch details for asteroid: ${asteroidId}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching asteroid ${asteroidId}:`, error);
    throw error;
  }
};


export {
  fetchApod,
  fetchPlanets,
  fetchPlanetDetails,
  fetchMissions,
  fetchSatellites,
  fetchSatelliteDetail,
  fetchAsteroids,
  fetchAsteroidDetails
};

