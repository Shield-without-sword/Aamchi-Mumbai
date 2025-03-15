import React from 'react';
import { Link } from 'react-router-dom';
import { DeleteEmployeeById } from '../api';
import { notify } from '../utils';
import { MapPin, Users, Building } from 'lucide-react';

function EmployeeTable({
  employees = [],
  handleUpdateEmployee,
}) {
  const handleDeleteEmployee = async (id) => {
    try {
      const { success, message } = await DeleteEmployeeById(id);
      if (success) {
        notify(message, 'success');
      } else {
        notify(message, 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Failed to delete Employee', 'error');
    }
  };

  const EmployeeCard = ({ employee }) => (
    <div className="relative rounded-2xl bg-gradient-to-br from-gray-500 to-gray-300 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="w-28 h-28 rounded-xl overflow-hidden ring-2 ring-green-100">
          <img
            src={employee.profileImage || '/api/placeholder/300/300'}
            alt={`${employee.name}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <Link
            to={`/dashboard/employee/${employee._id}`}
            className="text-xl font-semibold text-gray-800 hover:text-green-600 transition-colors"
          >
            {employee.name}
          </Link>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{employee.about}</p>

          <div className="mt-3 flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full">
              <MapPin size={14} className="text-green-600" />
              <span className="text-xs text-green-700">{employee.location}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full">
              <Building size={14} className="text-blue-600" />
              <span className="text-xs text-blue-700">{employee.Breed}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-full">
              <Users size={14} className="text-purple-600" />
              <span className="text-xs text-purple-700">{employee.capacity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Absolute positioned at bottom right */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        {handleUpdateEmployee && (
          <button
            onClick={() => handleUpdateEmployee(employee)}
            className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => handleDeleteEmployee(employee._id)}
          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {employees.length === 0 ? (
        <div className="col-span-full flex items-center justify-center py-12">
          <div className="text-center bg-white rounded-xl p-8 shadow-lg">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-xl font-medium text-gray-800">No Employees Found</div>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        </div>
      ) : (
        employees.map((emp) => <EmployeeCard employee={emp} key={emp._id} />)
      )}
    </div>
  );
}

export default EmployeeTable;