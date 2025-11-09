import React from 'react';
import { Search, Calendar, Edit, Eye, Trash2 } from 'lucide-react';

const ListedProgramsCard = () => {

  // Sample programs data
  const programs = [
    {
      id: 1,
      serialNo: 'A',
      courseName: 'Computer Science',
      duration: '4 Years',
      status: 'Live',
      statusColor: 'bg-green-100 text-green-800',
      startDate: '20 Aug 2024',
      endDate: '20 Aug 2028',
      leadsGenerated: 36,
      views: 245
    },
    {
      id: 2,
      serialNo: 'B',
      courseName: 'Electrical Engineering',
      duration: '4 Years',
      status: 'Live',
      statusColor: 'bg-green-100 text-green-800',
      startDate: '20 Aug 2024',
      endDate: '20 Aug 2028',
      leadsGenerated: 24,
      views: 189
    },
    {
      id: 3,
      serialNo: 'C',
      courseName: 'Civil Engineering',
      duration: '4 Years',
      status: 'Live',
      statusColor: 'bg-green-100 text-green-800',
      startDate: '20 Aug 2024',
      endDate: '20 Aug 2028',
      leadsGenerated: 24,
      views: 167
    },
    {
      id: 4,
      serialNo: 'D',
      courseName: 'Mechanical Engineering',
      duration: '4 Years',
      status: 'Live',
      statusColor: 'bg-green-100 text-green-800',
      startDate: '20 Aug 2024',
      endDate: '20 Aug 2028',
      leadsGenerated: 24,
      views: 203
    }
  ];


  return (
    <div 
      className="mx-auto bg-white rounded-lg shadow-lg border border-gray-100"
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
      <div className="p-4 bg-white">
        {/* Programs Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-900">Your Listed Programs</h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-0.5">
            {['Program Details', 'Add Program'].map((tab) => (
              <button
                key={tab}
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors bg-white text-gray-900 shadow-sm"
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500">Filter by Status</div>
        </div>

        {/* Search Bar */}
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
            <input
              type="text"
              placeholder="Search your programs"
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-gray-50 rounded-t-lg px-3 py-2 border border-gray-200">
          <div className="grid grid-cols-7 gap-2 text-xs font-medium text-gray-600">
            <div>S.No</div>
            <div>Course Name</div>
            <div>Status</div>
            <div>Start Date</div>
            <div>End Date</div>
            <div>Leads Generated</div>
            <div>Action</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="border-x border-b border-gray-200 rounded-b-lg bg-white max-h-32">
          {programs.map((program) => (
            <div
              key={program.id}
              className="grid grid-cols-7 gap-2 px-3 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors text-xs"
            >
              <div className="text-gray-600">{program.serialNo}</div>
              <div>
                <div className="font-medium text-gray-900">{program.courseName}</div>
                <div className="text-gray-500 text-xs">{program.duration}</div>
              </div>
              <div>
                <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full ${program.statusColor}`}>
                  {program.status}
                </span>
              </div>
              <div className="text-gray-600">{program.startDate}</div>
              <div className="text-gray-600">{program.endDate}</div>
              <div className="text-gray-900 font-medium">{program.leadsGenerated}</div>
              <div className="flex space-x-1">
                <button className="text-gray-400 hover:text-blue-600">
                  <Eye className="h-3 w-3" />
                </button>
                <button className="text-gray-400 hover:text-green-600">
                  <Edit className="h-3 w-3" />
                </button>
                <button className="text-gray-400 hover:text-red-600">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="text-center mt-3">
          <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
            View more
          </button>
        </div>

        {/* Transaction History */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-900">Transaction History</h3>
        </div>
      </div>
    </div>
  );
};

export default ListedProgramsCard;