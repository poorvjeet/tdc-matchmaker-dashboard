import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerCard = ({ customer, getStatusColor }) => {
  const navigate = useNavigate();

  const getStatusTagColor = (status) => {
    switch (status) {
      case 'New': return 'bg-cream text-burgundy';
      case 'In Progress': return 'bg-saffron text-white';
      case 'Matched': return 'bg-emerald text-white';
      case 'On Hold': return 'bg-gray-400 text-white';
      default: return 'bg-cream text-burgundy';
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/customer/${customer.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-burgundy text-white rounded-full flex items-center justify-center font-bold mr-3">
            {(customer.name || `${customer.firstName} ${customer.lastName}`).split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-playfair text-lg font-semibold text-burgundy">
              {customer.name}
            </h3>
            <p className="text-gray-600 text-sm">
              {customer.age} years | {customer.gender}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusTagColor(customer.status)}`}>
          {customer.status}
        </span>
      </div>
      <div className="text-gray-700">
        <p className="mb-1">
          <span className="font-medium">City:</span> {customer.city}
        </p>
        <p className="mb-1">
          <span className="font-medium">Customer ID:</span> {customer.id}
        </p>
      </div>
    </div>
  );
};

export default CustomerCard;