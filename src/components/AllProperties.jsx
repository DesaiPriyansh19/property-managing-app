import React, { useState } from 'react';

export default function AllProperties() {
  const [searchTerm, setSearchTerm] = useState('');

  const properties = [
    {
      id: 1,
      title: 'Modern Apartment',
      location: 'Downtown, NYC',
      price: '$2,500/mo',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      title: 'Cozy Cottage',
      location: 'Asheville, NC',
      price: '$1,200/mo',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 3,
      title: 'Luxury Villa',
      location: 'Beverly Hills, CA',
      price: '$10,000/mo',
      image: 'https://via.placeholder.com/300x200',
    },
  ];

  const filteredProperties = properties.filter(
    (prop) =>
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-300 min-h-screen py-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-700">All Properties</h1>
  <h1 className="text-2xl font-bold mb-6 text-center text-gray-600">Title Clear Properties</h1>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-500 rounded-xl outline-none shadow-sm bg-white text-gray-800"
        />
        <button className="px-6 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition w-full md:w-auto">
          Search
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {filteredProperties.map((prop) => (
          <div key={prop.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-400">
            <img
              src={prop.image}
              alt={prop.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{prop.title}</h2>
              <p className="text-gray-600 mb-1">{prop.location}</p>
              <p className="text-black font-semibold">{prop.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
