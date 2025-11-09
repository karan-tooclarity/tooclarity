import React from 'react';
import _AdCard from '../dashboard/AdCard';
import { Search, Calendar, MessageCircle, Linkedin } from 'lucide-react';

const StaticDashboardCard = () => {
  return (
    <div 
      className="mx-auto bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
      style={{
        width: '500px',
        height: '355.83px',
        background: '#EBEEFF'
      }}
    >
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-xs">TC</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
              <input
                type="text"
                placeholder="Search here"
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-32"
                readOnly
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div>
                <div className="text-xs font-medium text-gray-900">Subhash Chotti</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 bg-white overflow-hidden">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-0.5">
            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-white text-gray-900 shadow-sm">
              Weekly
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-600">
              Monthly
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-600">
              Yearly
            </button>
          </div>
        </div>

        {/* Stats and Social Section */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {/* Stats Cards */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Program Views</h3>
            <div className="text-xl font-bold text-gray-900">420</div>
            <div className="text-xs text-blue-600 mt-1">+12.5% from previous week</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Course Views</h3>
            <div className="text-xl font-bold text-gray-900">340</div>
            <div className="text-xs text-green-600 mt-1">+8.2% from previous week</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Leads Generated</h3>
            <div className="text-xl font-bold text-gray-900">270</div>
            <div className="text-xs text-red-600 mt-1">-3.1% from previous week</div>
          </div>

          {/* Social Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 relative">
            {/* <AdCard/> */}

            <div className="text-xs font-medium text-gray-900 mb-2">Increase your reach</div>
            <div className="flex space-x-2 mb-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="h-3 w-3 text-white" />
              </div>
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Linkedin className="h-3 w-3 text-white" />
              </div>
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium">
              Share Now
            </button>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Recent Inquiries</h2>
          
          {/* Table Header */}
          <div className="bg-gray-50 rounded-t-lg px-3 py-2 border border-gray-200">
            <div className="grid grid-cols-4 gap-3 text-xs font-medium text-gray-600">
              <div>Date</div>
              <div>Customer name</div>
              <div>Program interest</div>
              <div>Inquiry Type</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="border-x border-b border-gray-200 rounded-b-lg bg-white overflow-hidden">
            {/* Row 1 */}
            <div className="grid grid-cols-4 gap-3 px-3 py-1.5 border-b border-gray-100">
              <div className="text-xs text-gray-600">6/01/2024</div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-medium">SC</span>
                </div>
                <span className="text-xs font-medium text-gray-900 truncate">Santhosh</span>
              </div>
              <div className="text-xs text-gray-600 truncate">B.Tech Computer Science</div>
              <div className="text-xs text-gray-600">Requested for call back</div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-4 gap-3 px-3 py-1.5 border-b border-gray-100">
              <div className="text-xs text-gray-600">5/31/2024</div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-medium">AJ</span>
                </div>
                <span className="text-xs font-medium text-gray-900 truncate">Arjun</span>
              </div>
              <div className="text-xs text-gray-600 truncate">B.Tech Computer Science</div>
              <div className="text-xs text-gray-600">Requested for call back</div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-4 gap-3 px-3 py-1.5 border-b border-gray-100">
              <div className="text-xs text-gray-600">5/30/2024</div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-medium">MN</span>
                </div>
                <span className="text-xs font-medium text-gray-900 truncate">Manvith</span>
              </div>
              <div className="text-xs text-gray-600 truncate">B.Tech Computer Science</div>
              <div className="text-xs text-gray-600">Requested for call back</div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-4 gap-3 px-3 py-1.5">
              <div className="text-xs text-gray-600">5/29/2024</div>
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-medium">PK</span>
                </div>
                <span className="text-xs font-medium text-gray-900 truncate">Priyanka</span>
              </div>
              <div className="text-xs text-gray-600 truncate">B.Tech Computer Science</div>
              <div className="text-xs text-gray-600">Requested for call back</div>
            </div>
          </div>
        </div>

        {/* Program Reach Over Time Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Program Reach Over Time</h3>
          
          {/* Mini Chart */}
          <div className="h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 48">
              {/* Background grid lines */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Area chart */}
              <path
                d="M 20 35 Q 80 25, 120 30 T 200 20 T 280 25 T 360 15 L 360 45 L 20 45 Z"
                fill="url(#areaGradient)"
              />
              
              {/* Line chart */}
              <path
                d="M 20 35 Q 80 25, 120 30 T 200 20 T 280 25 T 360 15"
                stroke="#3B82F6"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Data points */}
              {[20, 80, 120, 200, 280, 360].map((x, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={[35, 25, 30, 20, 25, 15][i]}
                  r="2"
                  fill="#3B82F6"
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticDashboardCard;