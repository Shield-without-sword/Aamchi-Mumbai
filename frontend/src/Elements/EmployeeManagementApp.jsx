import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeTable from './EmployeeTable';
import { GetAllEmployees } from '../api';
import { ToastContainer } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { Search, Filter, Calendar, MapPin, Users, Star, Clock, Heart } from 'lucide-react';

const EmployeeManagementApp = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');

    const fetchEmployees = async (search = '') => {
        try {
            const data = await GetAllEmployees(search, 1, 1000);
            setEmployees(data.employees);
        } catch (err) {
            alert('Error', err);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSearch = (e) => {
        fetchEmployees(e.target.value);
    };

    const handleUpdateEmployee = (emp) => {
        navigate(`/dashboard/employee/edit/${emp._id}`, { state: { employee: emp } });
    };

    // Categories for filtering events
    const categories = [
        'All', 'Anniversary', 'Reunion', 'Conference', 'Team Building', 'Workshop'
    ];

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
                
                <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <Button 
                            className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl border-none"
                            onClick={() => navigate('/dashboard/employee/add')}
                        >
                            <Heart className="mr-2 h-5 w-5" />
                            Create New Event
                        </Button>
                        
                        <div className="relative w-full md:w-1/2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                            <input
                                onChange={handleSearch}
                                type="text"
                                placeholder="Search events..."
                                className="w-full bg-black/30 text-white placeholder-white/60 border border-white/20 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Event categories */}
                    <div className="flex flex-wrap gap-2 mb-6 justify-center">
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

                    {/* Event Highlight */}
                    {/* Employee/Events Table */}
                    <div className="bg-black/30 rounded-xl p-6 backdrop-blur-md border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-4">All Events</h2>
                        <EmployeeTable 
    employees={employees} 
    handleUpdateEmployee={handleUpdateEmployee} // ✅ Correct prop name

                            onDeleteEmployee={(id) => {
                                // Handle deletion logic
                                if (window.confirm('Are you sure you want to delete this event?')) {
                                    // Delete API call would go here
                                    setEmployees(employees.filter(emp => emp._id !== id));
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default EmployeeManagementApp;