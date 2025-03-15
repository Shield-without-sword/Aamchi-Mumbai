import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetEmployeeDetailsById, GetAllRSVPs } from '../api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Camera, Calendar, MapPin, Users, Mail, Phone, Loader2, Heart } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const EventLocationMap = ({ location }) => {
  useEffect(() => {
    // Initialize map after component mounts
    const map = L.map('map').setView([0, 0], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Geocode the location and set marker
    const searchLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        const data = await response.json();

        if (data && data[0]) {
          const { lat, lon } = data[0];
          map.setView([lat, lon], 13);
          
          // Custom marker icon
          const customIcon = L.divIcon({
            html: `<div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                     <div class="w-6 h-6 text-white">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                       </svg>
                     </div>
                   </div>`,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          });

          L.marker([lat, lon], { icon: customIcon })
            .addTo(map)
            .bindPopup(location)
            .openPopup();
        }
      } catch (error) {
        console.error('Error geocoding location:', error);
      }
    };

    searchLocation();

    // Cleanup
    return () => {
      map.remove();
    };
  }, [location]);

  return <div id="map" style={{ height: '400px' }} className="rounded-xl overflow-hidden shadow-2xl" />;
};

const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [rsvps, setRSVPs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories for filtering RSVPs
  const categories = [
    'All', 'Going', 'Not Going', 'Pending'
  ];

  const fetchEmployeeDetails = async () => {
    try {
      const data = await GetEmployeeDetailsById(id);
      setEmployee(data);
      return data;
    } catch (err) {
      setError('Failed to fetch event details: ' + err.message);
      return null;
    }
  };

  const fetchRSVPData = async () => {
    try {
      const data = await GetAllRSVPs('', 1, 100);
      if (Array.isArray(data)) {
        setRSVPs(data);
      } else if (data.rsvps && Array.isArray(data.rsvps)) {
        setRSVPs(data.rsvps);
      } else {
        console.error('Unexpected RSVP data structure:', data);
        setRSVPs([]);
      }
    } catch (err) {
      setError('Failed to fetch RSVP data: ' + err.message);
      setRSVPs([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchEmployeeDetails(), fetchRSVPData()]);
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  // Filter RSVPs based on active category
  const filteredRSVPs = rsvps.filter(rsvp => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Going') return rsvp.response === 'going';
    if (activeCategory === 'Not Going') return rsvp.response !== 'going';
    if (activeCategory === 'Pending') return !rsvp.response;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[url('https://via.placeholder.com/1920x1080')] bg-cover bg-fixed relative">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/90 via-purple-700/80 to-blue-900/90 backdrop-filter backdrop-blur-sm"></div>
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[url('https://via.placeholder.com/1920x1080')] bg-cover bg-fixed relative">
      {/* Orange top to blue gradient as requested */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-600/90 via-purple-700/80 to-blue-900/90 backdrop-filter backdrop-blur-sm"></div>
      
      {/* Gateway of India Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden">
        <svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,200 L0,150 L50,150 L75,100 L100,150 L125,120 L150,150 L175,130 L200,150 L250,150 L250,200 Z" fill="black" opacity="0.7" />
          {/* Gateway of India */}
          <path d="M400,200 L400,80 C400,70 420,70 420,80 L420,50 L480,50 L480,80 C480,70 500,70 500,80 L500,200 Z" fill="black" opacity="0.7" />
          <path d="M430,50 L470,50 L470,30 C470,10 430,10 430,30 Z" fill="black" opacity="0.7" />
          {/* Marine Drive Buildings */}
          <path d="M600,200 L600,100 L620,100 L620,200 Z M630,200 L630,120 L650,120 L650,200 Z M660,200 L660,90 L680,90 L680,200 Z M690,200 L690,110 L710,110 L710,200 Z M720,200 L720,80 L740,80 L740,200 Z" fill="black" opacity="0.7" />
          {/* Local train */}
          <path d="M800,150 L800,120 L950,120 L950,150 L800,150 Z M810,120 L810,110 L830,110 L830,120 Z M840,120 L840,110 L860,110 L860,120 Z M870,120 L870,110 L890,110 L890,120 Z M900,120 L900,110 L920,110 L920,120 Z" fill="black" opacity="0.6" />
          <path d="M790,150 L800,120 M950,120 L960,150 L790,150 Z" fill="black" opacity="0.6" />
          {/* Bandra-Worli Sea Link */}
          <path d="M1000,200 C1000,120 1100,120 1100,200" stroke="black" strokeWidth="5" fill="none" opacity="0.7" />
          <path d="M1000,160 L1100,160" stroke="black" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M1020,160 L1020,130 M1050,160 L1050,130 M1080,160 L1080,130" stroke="black" strokeWidth="3" fill="none" opacity="0.7" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Maratha inspired Header with Eventify title */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">मुंबई</span>
              <span className="text-white px-2">Eventify</span>
            </h1>
            <div className="text-white/80 text-sm">Celebrating our Shared Moments and Milestones</div>
          </div>
        </div>
        
        {/* Navigation Bar */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/photo')}
            className="flex items-center gap-2 bg-black/30 text-white border-white/20 hover:bg-black/40 transition-all duration-300"
          >
            <Camera size={18} />
            Gallery
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate(`/rsvp/${id}`)}
            className="flex items-center gap-2 bg-black/30 text-white border-white/20 hover:bg-black/40 transition-all duration-300"
          >
            <Calendar size={18} />
            RSVP Page
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard/employee')}
            className="flex items-center gap-2 bg-black/30 text-white border-white/20 hover:bg-black/40 transition-all duration-300"
          >
            ← Back to Dashboard
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-500/10 border border-red-500/20 text-red-200 backdrop-blur-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {employee && (
          <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 mb-8">
            {/* Event Information Card */}
            <Card className="overflow-hidden border-none shadow-2xl bg-black/30 mb-8">
              <CardHeader className="bg-gradient-to-r from-orange-500/20 to-blue-500/20">
                <CardTitle className="text-2xl font-bold text-white">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Left side - Image */}
                  <div className="relative h-[400px] overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                    <img
                      src={employee.profileImage || 'https://via.placeholder.com/800x600'}
                      alt={`${employee.name}'s event photo`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-0 left-0 p-6 z-20">
                      <h3 className="text-3xl font-bold text-white mb-2">{employee.name}</h3>
                      <div className="flex items-center gap-2 text-white/80">
                        <Heart size={16} className="text-orange-400" />
                        <p>Event Host: Yash</p>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Stats */}
                  <div className="p-8 bg-black/30 backdrop-blur-lg space-y-6">
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-white/5 backdrop-blur-lg transition-all duration-300 hover:bg-white/10">
                      <Users className="w-8 h-8 text-orange-400" />
                      <div>
                        <p className="text-white/60 text-sm">Event Capacity</p>
                        <p className="text-white text-xl font-semibold">{employee.capacity || 'Unlimited'} people</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-white/5 backdrop-blur-lg transition-all duration-300 hover:bg-white/10">
                      <Calendar className="w-8 h-8 text-orange-400" />
                      <div>
                        <p className="text-white/60 text-sm">Date</p>
                        <p className="text-white text-xl font-semibold">
                          {employee.createdAt ? format(parseISO(employee.createdAt), "dd MMMM, yyyy") : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 p-6 rounded-xl bg-white/5 backdrop-blur-lg transition-all duration-300 hover:bg-white/10">
                      <MapPin className="w-8 h-8 text-orange-400" />
                      <div>
                        <p className="text-white/60 text-sm">Location</p>
                        <p className="text-white text-xl font-semibold">{employee.location || 'TBD'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

        {/* Event Location Map */}
        <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Event Location</h3>
              {employee.location && <EventLocationMap location={employee.location} />}
            </div>

            {/* RSVP Information Card */}
            <Card className="overflow-hidden border-none shadow-2xl bg-black/30">
              <CardHeader className="bg-gradient-to-r from-orange-500/20 to-blue-500/20">
                <CardTitle className="text-2xl font-bold text-white">RSVP Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* RSVP categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeCategory === category
                          ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-lg'
                          : 'bg-black/30 text-white/80 hover:bg-black/40'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 px-6 text-left font-medium text-white/60">Guest</th>
                        <th className="py-4 px-6 text-left font-medium text-white/60">Contact</th>
                        <th className="py-4 px-6 text-left font-medium text-white/60">Status</th>
                        <th className="py-4 px-6 text-left font-medium text-white/60">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(filteredRSVPs) && filteredRSVPs.length > 0 ? (
                        filteredRSVPs.map((rsvp, index) => (
                          <tr 
                            key={rsvp._id || index}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div className="font-medium text-white">{rsvp.name}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-white/80">
                                  <Mail size={14} />
                                  {rsvp.email}
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                  <Phone size={14} />
                                  {rsvp.phone}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                rsvp.response === 'going' 
                                  ? 'bg-green-500/20 text-green-300' 
                                  : rsvp.response === undefined
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}>
                                {rsvp.response === 'going' ? 'Going' : rsvp.response === undefined ? 'Pending' : 'Not Going'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-white/80">
                              {rsvp.createdAt ? format(parseISO(rsvp.createdAt), 'MMM dd, yyyy') : 'N/A'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-white/60">
                            No RSVP responses yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;