import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Calendar, Users, Trophy, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calendar className="w-12 h-12 text-orange-500" />,
      title: "Smart Planning",
      description: "AI-powered event scheduling and management tools",
      gradient: "from-orange-500/20 to-pink-500/20"
    },
    {
      icon: <Users className="w-12 h-12 text-pink-500" />,
      title: "Seamless Collaboration",
      description: "Real-time coordination with your team and vendors",
      gradient: "from-pink-500/20 to-purple-500/20"
    },
    {
      icon: <Trophy className="w-12 h-12 text-purple-500" />,
      title: "Event Analytics",
      description: "Detailed insights and performance metrics",
      gradient: "from-purple-500/20 to-orange-500/20"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[60rem] h-[60rem] bg-orange-500 opacity-30 blur-3xl rounded-full -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[60rem] h-[60rem] bg-pink-500 opacity-20 blur-3xl rounded-full -bottom-40 -right-40 animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mt-20 z-10 relative">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-orange-400 animate-bounce" />
          <span className="text-xl font-medium text-orange-400">The Future of Event Management</span>
        </div>
        
        <h1 className="text-6xl sm:text-7xl font-extrabold mb-6 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 text-transparent bg-clip-text animate-gradient">
          Welcome to Eventify
        </h1>
        
        <p className="text-2xl sm:text-3xl font-light mb-8 text-gray-300">
          <span className="italic">"Transform your events into unforgettable experiences"</span>
        </p>
        
        <p className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto text-gray-400">
          Join thousands of event planners who trust Eventify to create, manage, and deliver exceptional events that leave lasting impressions.
        </p>
      </div>

      {/* Call-to-Actions */}
      <div className="flex flex-col sm:flex-row gap-6 mb-16 z-10">
        <Button
          onClick={() => navigate("/signup")}
          className="px-8 py-6 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 text-lg flex items-center gap-2 group transform hover:scale-105"
        >
          Start Creating
          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        </Button>
        
        <Button
          onClick={() => navigate("/login")}
          className="px-8 py-6 bg-gray-800 text-white font-semibold rounded-xl shadow-lg hover:bg-gray-700 transition-all duration-300 text-lg border border-gray-700 hover:border-gray-600"
        >
          Sign In
        </Button>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto z-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className={"bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border border-gray-800 rounded-xl p-8 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group"}
          >
            <div className="mb-4 transform group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-white">
              {feature.title}
            </h3>
            <p className="text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto z-10 text-center">
        {[
          { value: "10K+", label: "Events Created" },
          { value: "50K+", label: "Active Users" },
          { value: "98%", label: "Success Rate" },
          { value: "24/7", label: "Support" }
        ].map((stat, index) => (
          <div key={index} className="p-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text">
              {stat.value}
            </div>
            <div className="text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}