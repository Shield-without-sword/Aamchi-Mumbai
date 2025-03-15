import React, { useState } from 'react';
import { Code, Book, Key, Calendar, Mail, UserCheck, Image } from 'lucide-react';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('quickstart');

  const CodeBlock = ({ code, language = "bash" }) => (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 my-4 shadow-lg transform transition-all duration-200 hover:scale-[1.02] border border-gray-700">
      <pre className="text-gray-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  const TabIcon = ({ tab }) => {
    const icons = {
      quickstart: <Code size={20} />,
      authentication: <Key size={20} />,
      events: <Calendar size={20} />,
      invitations: <Mail size={20} />,
      rsvp: <UserCheck size={20} />,
      albums: <Image size={20} />
    };
    return icons[tab];
  };

  const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-3xl font-bold text-white">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header with gradient text */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-transparent bg-clip-text">
            Event Management API
          </h1>
          <p className="text-xl text-gray-300">
            Build incredible event experiences with our powerful API
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {['quickstart', 'authentication', 'events', 'invitations', 'rsvp', 'albums'].map((tab) => (
            <button
              key={tab}
              className={`flex items-center gap-2 py-3 px-6 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <TabIcon tab={tab} />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
          {/* Quick Start Section */}
          {activeTab === 'quickstart' && (
            <div className="space-y-8">
              <SectionHeader icon={<Code className="text-white" size={20} />} title="Quick Start Guide" />
              
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-100">Installation</h3>
                  <CodeBlock code="npm install @your-org/event-management-sdk" />
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-100">Initialize the Client</h3>
                  <CodeBlock 
                    code={`import { EventManagementClient } from '@your-org/event-management-sdk';

const client = new EventManagementClient({
  apiKey: 'your_api_key',
  environment: 'production' // or 'sandbox' for testing
});`}
                  />
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-100">Create Your First Event</h3>
                  <CodeBlock 
                    code={`const event = await client.events.create({
  title: 'My Awesome Event',
  date: '2025-03-15T18:00:00Z',
  location: '123 Main St, City',
  description: 'Join us for an amazing evening!'
});

console.log(event.id); // Use this ID for invitations`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Authentication Section */}
          {activeTab === 'authentication' && (
            <div className="space-y-8">
              <SectionHeader icon={<Key className="text-white" size={20} />} title="Authentication" />

              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border border-yellow-500/30">
                <p className="text-yellow-200 font-medium">
                  🔐 Never expose your API keys in client-side code. Always make API calls from your server.
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-gray-100">Obtaining API Keys</h3>
                <p className="text-gray-300 mb-4">
                  Secure your API keys from the developer dashboard. We use Bearer token authentication for all API requests.
                </p>
                <CodeBlock 
                  code={`curl -H "Authorization: Bearer your_api_key" \
  https://api.eventmanagement.com/v1/events`}
                />
              </div>
            </div>
          )}

          {/* Events Section */}
          {activeTab === 'events' && (
            <div className="space-y-8">
              <SectionHeader icon={<Calendar className="text-white" size={20} />} title="Events API" />
              
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-100">Create Event</h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">POST /v1/events</span>
                  </div>
                  <CodeBlock 
                    code={`{
  "title": "Birthday Party",
  "date": "2025-03-15T18:00:00Z",
  "location": "123 Main St",
  "description": "Join us for cake!",
  "capacity": 50,
  "isPrivate": true
}`}
                  />
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-100">Get Event Details</h3>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">GET /v1/events/:eventId</span>
                  </div>
                  <CodeBlock 
                    code={`// Response
{
  "id": "evt_123",
  "title": "Birthday Party",
  "date": "2025-03-15T18:00:00Z",
  "location": "123 Main St",
  "description": "Join us for cake!",
  "capacity": 50,
  "attendeeCount": 12,
  "status": "active"
}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Invitations Section */}
          {activeTab === 'invitations' && (
            <div className="space-y-8">
              <SectionHeader icon={<Mail className="text-white" size={20} />} title="Invitations API" />
              
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-100">Send Invitations</h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      POST /v1/events/:eventId/invitations
                    </span>
                  </div>
                  <CodeBlock 
                    code={`{
  "recipients": [
    {
      "email": "guest@example.com",
      "name": "John Doe",
      "type": "guest"
    }
  ],
  "message": "Hope you can make it!",
  "allowPlusOne": true
}`}
                  />
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-100">Check Invitation Status</h3>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      GET /v1/invitations/:invitationId
                    </span>
                  </div>
                  <CodeBlock 
                    code={`// Response
{
  "id": "inv_123",
  "status": "pending",
  "recipient": {
    "email": "guest@example.com",
    "name": "John Doe"
  },
  "rsvpDeadline": "2025-03-10T00:00:00Z",
  "plusOneAllowed": true
}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* RSVP Section */}
          {activeTab === 'rsvp' && (
            <div className="space-y-8">
              <SectionHeader icon={<UserCheck className="text-white" size={20} />} title="RSVP Management" />
              
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-100">Submit RSVP</h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      POST /v1/invitations/:invitationId/rsvp
                    </span>
                  </div>
                  <CodeBlock 
                    code={`{
  "eventId": {
    "$oid": "678c58446510536d6a1e90c2"
  },
  "name": "Yash Chougule",
  "email": "chouguleyash037@gmail.com",
  "phone": "08104733431",
  "response": "going",
  "createdAt": {
    "$date": { "$numberLong": "1740248531002" }
  },
}`}
                  />
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-100">Get RSVP Analytics</h3>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      GET /v1/events/:eventId/rsvp-analytics
                    </span>
                  </div>
                  <CodeBlock 
                    code={`// Response
{
  "totalInvited": 100,
  "attending": 45,
  "declined": 10,
  "pending": 45,
}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Albums Section */}
          {activeTab === 'albums' && (
            <div className="space-y-8">
              <SectionHeader icon={<Image className="text-white" size={20} />} title="Shared Albums API" />
              
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-100">Create Album</h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      POST /v1/events/:eventId/albums
                    </span>
                  </div>
                  <CodeBlock 
                    code={`{
  "title": "Event Photos",
  "description": "Official event photos",
  "permissions": {
    "upload": "attendees",
    "view": "all"
  }
}`}
                  />
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-100">Upload Media</h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      POST /v1/albums/:albumId/media
                    </span>
                  </div>
                  <CodeBlock 
                    code={`// Multipart form data
{
  "file": "(binary)",
  "caption": "Great moment!",
  "metadata": {
    "takenAt": "2025-03-15T19:30:00Z",
    "location": "Main Hall"
  }
}`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documentation;