import { useState } from "react";

const BuyerManagement = () => {
  // Group options for both the form and filter
  const groupOptions = [
    "Title Clear Lands",
    "Dispute Lands",
    "Govt. Dispute Lands",
    "FP / NA",
    "Others",
  ];

  const [brokers, setBrokers] = useState([]);
  const [newBroker, setNewBroker] = useState({
    name: "",
    contact: "",
    address: "",
    workarea: "",
    notes: "",
    groups: [], // stores multiple groups
  });

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState([]); // groups for filtering

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBroker({ ...newBroker, [name]: value });
  };

  // Handle multi-select checkbox changes for groups in the form
  const handleGroupSelectChange = (option) => {
    const updatedGroups = newBroker.groups.includes(option)
      ? newBroker.groups.filter((g) => g !== option)
      : [...newBroker.groups, option];
    setNewBroker({ ...newBroker, groups: updatedGroups });
  };

  // Add a new broker
  const handleAddBroker = () => {
    if (!newBroker.name || !newBroker.contact) {
      alert("Name and contact are required");
      return;
    }

    setBrokers([
      ...brokers,
      { id: Date.now(), ...newBroker }
    ]);

    // Reset the form
    setNewBroker({
      name: "",
      contact: "",
      address: "",
      workarea: "",
      notes: "",
      groups: [],
    });
    setShowForm(false);
  };

  // Delete a broker by ID
  const handleDelete = (id) => {
    setBrokers(brokers.filter((broker) => broker.id !== id));
  };

  // Edit a broker
  const handleEdit = (id) => {
    const brokerToEdit = brokers.find((broker) => broker.id === id);
    setNewBroker(brokerToEdit);
    setBrokers(brokers.filter((broker) => broker.id !== id));
    setShowForm(true);
  };

  // Handle the filtering of brokers based on selected groups
  const handleGroupFilterChange = (group) => {
    setGroupFilter((prev) =>
      prev.includes(group)
        ? prev.filter((g) => g !== group)
        : [...prev, group]
    );
  };

  // Filtering brokers based on search query and selected group filters
  const filteredBrokers = brokers.filter((broker) => {
    const matchesSearch = Object.values(broker).some((val) =>
      typeof val === "string" &&
      val.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesGroup =
      groupFilter.length === 0 ||
      broker.groups?.some((g) => groupFilter.includes(g));

    return matchesSearch && matchesGroup;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-slate-300">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Buyers Data
      </h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-gray-700 text-white px-6 py-2 rounded-xl shadow hover:scale-105 transition-transform"
      >
        {showForm ? "Cancel" : "+ Add New Buyer"}
      </button>

      {/* Form to add a new broker */}
      {showForm && (
        <div className="bg-gray-200 p-6 rounded-xl shadow-xl mb-6 border border-gray-700/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={newBroker.name}
              onChange={handleInputChange}
              placeholder="Buyer Name"
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
              placeholder="Group Name"
              className="border border-gray-700 p-2 rounded-lg"
            />
            <input
              type="text"
              name="workarea"
              value={newBroker.workarea}
              onChange={handleInputChange}
              placeholder="Work Area"
              className="border border-gray-700 p-2 rounded-lg"
            />
          </div>
          <input
            type="text"
            name="notes"
            value={newBroker.notes}
            onChange={handleInputChange}
            placeholder="Notes"
            className="border border-gray-700 p-2 rounded-lg w-full my-4 "
          />
          {/* Group Checkboxes (Multi-select in Form) */}
          <div className="flex flex-wrap gap-4 mt-4 mb-4">
            {groupOptions.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newBroker.groups.includes(option)}
                  onChange={() => handleGroupSelectChange(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>

       

          <button
            onClick={handleAddBroker}
            className="mt-4 bg-gray-700 text-white px-6 py-2 rounded-xl hover:scale-105 transition-transform"
          >
            Save Buyer
          </button>
        </div>
      )}

<div className="flex flex-col gap-6 p-6 bg-gray-200 rounded-lg shadow-lg my-3">
  {/* Search Bar */}
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search buyer..."
    className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
  />

  {/* Group Filters (Checkboxes for Search Filtering) */}
  <div className="flex flex-wrap gap-6">
    <p className="text-gray-700 font-semibold text-lg">Filter:</p>
    {groupOptions.map((option) => (
      <label key={option} className="flex items-center gap-2 text-gray-600">
        <input
          type="checkbox"
          checked={groupFilter.includes(option)}
          onChange={() => handleGroupFilterChange(option)}
          className="h-5 w-5 border-gray-400 rounded-lg"
        />
        <span className="text-sm">{option}</span>
      </label>
    ))}
  </div>
</div>

      {/* Display the filtered brokers */}
      <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2">
        {filteredBrokers.length === 0 ? (
          <p className="text-gray-600">No buyer found.</p>
        ) : (
          filteredBrokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-gray-200 border border-gray-700/30 rounded-lg shadow-md p-4 flex justify-between items-start"
            >
              <div>
                <h2 className="text-xl font-semibold text-[#7B3F00]">
                  {broker.name}
                </h2>
                <p>📞 {broker.contact}</p>
                <p>📍 {broker.address}</p>
                <p>📝 {broker.notes}</p>
                <p>🔖 Groups: {broker.groups.join(", ")}</p> {/* Display the groups */}
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

export default BuyerManagement;
