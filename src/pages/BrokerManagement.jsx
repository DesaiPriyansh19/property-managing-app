import { useState } from "react";
import { Link } from "react-router-dom";

const BrokerManagement = () => {
  const [brokers, setBrokers] = useState([]);
  const [newBroker, setNewBroker] = useState({
    name: "",
    contact: "",
    address: "",
    notes: "",
    landType: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLandTypes, setSelectedLandTypes] = useState([]);

  const landTypeOptions = [
    "Title Clear Lands",
    "Dispute Lands",
    "Govt.Dispute Lands",
    "FP / NA",
    "Others",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBroker({ ...newBroker, [name]: value });
  };

  const handleLandTypeChange = (e) => {
    const { value, checked } = e.target;
    setNewBroker((prev) => ({
      ...prev,
      landType: checked
        ? [...prev.landType, value]
        : prev.landType.filter((type) => type !== value),
    }));
  };

  const handleFilterCheckbox = (e) => {
    const { value, checked } = e.target;
    setSelectedLandTypes((prev) =>
      checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
  };

  const handleAddBroker = () => {
    if (!newBroker.name || !newBroker.contact) {
      alert("Name and contact are required");
      return;
    }

    setBrokers([
      ...brokers,
      { id: Date.now(), ...newBroker }
    ]);

    setNewBroker({ name: "", contact: "", address: "", notes: "", landType: [] });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setBrokers(brokers.filter((broker) => broker.id !== id));
  };

  const handleEdit = (id) => {
    const brokerToEdit = brokers.find((broker) => broker.id === id);
    setNewBroker(brokerToEdit);
    setBrokers(brokers.filter((broker) => broker.id !== id));
    setShowForm(true);
  };

  const filteredBrokers = brokers.filter((broker) => {
    const matchesSearch = Object.values(broker).some((val) =>
      typeof val === "string"
        ? val.toLowerCase().includes(searchQuery.toLowerCase())
        : false
    );
    const matchesLandType =
      selectedLandTypes.length === 0 ||
      broker.landType.some((type) => selectedLandTypes.includes(type));

    return matchesSearch && matchesLandType;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-300">
      <Link to={"/"}>
        <button className="absolute top-3 left-5 text-gray-500 border-2 px-2 rounded-md">
          Back
        </button>
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Brokers Data
      </h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-gray-700 text-white px-6 py-2 rounded-xl shadow hover:scale-105 transition-transform"
      >
        {showForm ? "Cancel" : "+ Add New Broker"}
      </button>

      {showForm && (
        <div className="bg-gray-200 p-6 rounded-xl shadow-xl mb-6 animate-fadeIn border border-gray-700/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={newBroker.name}
              onChange={handleInputChange}
              placeholder="Broker Name"
              className="border border-gray-700 p-2 rounded-lg"
            />
            <input
              type="text"
              name="contact"
              value={newBroker.contact}
              onChange={handleInputChange}
              placeholder="Contact Number"
              className="border border-gray-700 p-2 rounded-lg"
            />
            <input
              type="text"
              name="address"
              value={newBroker.address}
              onChange={handleInputChange}
              placeholder="Work Area"
              className="border border-gray-700 p-2 rounded-lg"
            />
            <input
              type="text"
              name="notes"
              value={newBroker.notes}
              onChange={handleInputChange}
              placeholder="Notes"
              className="border border-gray-700 p-2 rounded-lg"
            />
          </div>

          <div className="mt-4">
            <p className="font-medium mb-2 text-gray-500">Land Type(s):</p>
            <div className="flex flex-wrap gap-4">
              {landTypeOptions.map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    value={type}
                    checked={newBroker.landType.includes(type)}
                    onChange={handleLandTypeChange}
                    className="accent-gray-600"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddBroker}
            className="mt-6 bg-gray-700 text-white px-6 py-2 rounded-xl hover:scale-105 transition-transform"
          >
            Save Broker
          </button>
        </div>
      )}

<div className="flex flex-col gap-6 p-6 bg-gray-200 rounded-lg shadow-lg">
  {/* Search Bar */}
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search brokers..."
    className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />

  {/* Filter by Land Type */}
  <div className="mb-6">
    <p className="font-medium mb-2 text-gray-600 text-lg">Filter by Land Type:</p>
    <div className="flex flex-wrap gap-6">
      {landTypeOptions.map((type) => (
        <label key={type} className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            value={type}
            checked={selectedLandTypes.includes(type)}
            onChange={handleFilterCheckbox}
            className="accent-gray-600 h-5 w-5"
          />
          {type}
        </label>
      ))}
    </div>
  </div>
</div>


      <div className="space-y-4">
        {filteredBrokers.length === 0 ? (
          <p className="text-gray-600">No brokers found.</p>
        ) : (
          filteredBrokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-gray-200 border border-gray-700/30 rounded-lg shadow-md p-4 flex justify-between items-start"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-500">
                  {broker.name}
                </h2>
                <p>📞 {broker.contact}</p>
                <p>📍 {broker.address}</p>
                <p>📝 {broker.notes}</p>
                <p className="text-sm text-gray-600 mt-2">
                  🏷 Land Type(s): {broker.landType.join(", ")}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(broker.id)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(broker.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrokerManagement;