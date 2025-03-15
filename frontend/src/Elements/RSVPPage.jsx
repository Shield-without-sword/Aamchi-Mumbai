import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GetEmployeeDetailsById } from '../api';
import { createRSVPResponse } from '../api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Calendar, MapPin, Users, Heart, Mail, Phone } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import emailjs from '@emailjs/browser';

const RSVPPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    response: 'null'
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return format(parseISO(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      console.error('Date parsing error:', error);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const data = await GetEmployeeDetailsById(id);
        setEmployee(data);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const sendConfirmationEmail = async () => {
    try {
      const templateParams = {
        to_name: formData.name,
        to_email: formData.email,
        event_name: employee.name,
        event_date: formatDate(employee.startAt),
        event_location: employee.location,
        response_status: formData.response === 'going' ? 'Accepted' : 'Declined',
      };

      await emailjs.send(
        'service_wtdtxrk',
        'template_hetvc4v',
        templateParams,
        'JB2YupqQ3psOuc9HO'
      );
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send confirmation email');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.response || formData.response === 'null') {
      setError('Please select whether you are accepting or declining the invitation');
      setLoading(false);
      return;
    }
  
    try {
      // First, create the RSVP response
      const response = await createRSVPResponse({
        ...formData,
        eventId: id
      });
  
      if (response.success) {
        // Then, send the confirmation email
        await sendConfirmationEmail();
        navigate('/dashboard/employee');
      } else {
        throw new Error(response.message || 'Failed to submit RSVP');
      }
    } catch (err) {
      setError('Failed to process RSVP: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResponseChange = (value) => {
    setFormData(prev => ({
      ...prev,
      response: value
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[url('https://via.placeholder.com/1920x1080')] bg-cover bg-fixed relative">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/90 via-purple-700/80 to-blue-900/90 backdrop-filter backdrop-blur-sm"></div>
        <div className="container mx-auto p-4 relative z-10">
          <Alert variant="destructive" className="bg-red-500/80 text-white border-red-700">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen w-full bg-[url('https://via.placeholder.com/1920x1080')] bg-cover bg-fixed relative">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/90 via-purple-700/80 to-blue-900/90 backdrop-filter backdrop-blur-sm"></div>
        <div className="container mx-auto p-4 relative z-10">
          <div className="text-center text-white text-xl">Loading...</div>
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
        {/* Maratha inspired Header */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">मुंबई</span>
              <span className="text-white px-2">Eventify</span>
            </h1>
            <div className="text-white/80 text-sm">Celebrating our Shared Moments and Milestones</div>
          </div>
        </div>
        
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Event Details Section */}
          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-md border border-white/10 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2">
                <div className="relative rounded-lg overflow-hidden h-64 lg:h-96">
                  {employee.profileImage ? (
                    <img
                      src={employee.profileImage}
                      alt={`${employee.name}'s photo`}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/50 flex items-center justify-center rounded-lg border border-white/20">
                      <span className="text-white/60">No image available</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:w-1/2 space-y-6">
                <div className="bg-gradient-to-r from-orange-500/30 to-blue-600/30 p-6 rounded-lg border border-white/10">
                  <h2 className="text-3xl font-bold mb-4 text-white">{employee.name}</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-orange-400" />
                      <span className="text-white">{employee.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-orange-400" />
                      <span className="text-white">Capacity: {employee.capacity || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-orange-400" />
                      <span className="text-white">
                        Period: {formatDate(employee.createdAt)} - {formatDate(employee.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500/30 to-blue-600/30 p-6 rounded-lg border border-white/10">
                  <h3 className="text-xl font-semibold mb-3 text-white">About</h3>
                  <p className="text-white/90">{employee.about || 'No description available'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RSVP Form Section */}
          <div className="bg-black/30 rounded-xl p-6 backdrop-blur-md border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Heart className="h-6 w-6 text-orange-400 mr-2" />
              RSVP to this Event
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white/90">Your Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                        className="mt-1 bg-black/30 text-white border-white/20 focus:border-orange-400 focus:ring-orange-400/30 pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Users className="h-5 w-5 text-white/40" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-white/90">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email"
                        className="mt-1 bg-black/30 text-white border-white/20 focus:border-orange-400 focus:ring-orange-400/30 pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-white/40" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone" className="text-white/90">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your phone number"
                        className="mt-1 bg-black/30 text-white border-white/20 focus:border-orange-400 focus:ring-orange-400/30 pl-10"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="h-5 w-5 text-white/40" />
                      </div>
                      </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Label className="text-white/90">Your Response</Label>
                <div className="mt-2 space-y-3">
                  <Button
                    type="button"
                    onClick={() => handleResponseChange('going')}
                    className={`w-full flex items-center justify-center transition-all duration-300 ${
                      formData.response === 'going' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg' 
                        : 'bg-black/50 text-white/80 hover:bg-black/60 border border-white/10'
                    }`}
                  >
                    <Heart className={`mr-2 h-5 w-5 ${formData.response === 'going' ? 'text-white' : 'text-orange-400'}`} />
                    I Will Attend
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleResponseChange('not-going')}
                    className={`w-full flex items-center justify-center transition-all duration-300 ${
                      formData.response === 'not-going' 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg' 
                        : 'bg-black/50 text-white/80 hover:bg-black/60 border border-white/10'
                    }`}
                  >
                    <Heart className={`mr-2 h-5 w-5 ${formData.response === 'not-going' ? 'text-white' : 'text-orange-400'}`} />
                    I Cannot Attend
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border-none flex items-center justify-center h-12"
                  disabled={!formData.response || formData.response === 'null' || loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-5 w-5" />
                      Submit RSVP
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Return to Events button */}
          <div className="mt-6 text-center">
            <Button 
              type="button" 
              onClick={() => navigate('/dashboard/employee')}
              className="bg-black/40 hover:bg-black/60 text-white/80 border border-white/10 px-4 py-2 transition-all duration-300"
            >
              Return to Events
            </Button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-white/50 text-sm">
          <p>© 2025 मुंबई Eventify - Connecting People Through Experiences</p>
        </div>
      </div>
    </div>
  );
};

export default RSVPPage;