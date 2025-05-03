import { useState } from "react";

const BuyerManagement = () => {
  const [brokers, setBrokers] = useState([]);
  const [newBroker, setNewBroker] = useState({
    name: "",
    contact: "",
    address: "",
    notes: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBroker({ ...newBroker, [name]: value });
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

    setNewBroker({ name: "", contact: "", address: "", notes: "" });
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

  const filteredBrokers = brokers.filter((broker) =>
    Object.values(broker).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Buyers Data
      </h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-gradient-to-r from-[#7B3F00] to-[#A0522D] text-white px-6 py-2 rounded-xl shadow hover:scale-105 transition-transform"
      >
        {showForm ? "Cancel" : "+ Add New Buyer"}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-xl mb-6 animate-fadeIn border border-[#7B3F00]/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={newBroker.name}
              onChange={handleInputChange}
              placeholder="Broker Name"
              className="border border-[#7B3F00] p-2 rounded-lg"
            />
            <input
              type="text"
              name="contact"
              value={newBroker.contact}
              onChange={handleInputChange}
              placeholder="Contact Number"
              className="border border-[#7B3F00] p-2 rounded-lg"
            />
            <input
              type="text"
              name="address"
              value={newBroker.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="border border-[#7B3F00] p-2 rounded-lg"
            />
            <input
              type="text"
              name="notes"
              value={newBroker.notes}
              onChange={handleInputChange}
              placeholder="Notes"
              className="border border-[#7B3F00] p-2 rounded-lg"
            />
          </div>
          <button
            onClick={handleAddBroker}
            className="mt-4 bg-gradient-to-r from-[#7B3F00] to-[#A0522D] text-white px-6 py-2 rounded-xl hover:scale-105 transition-transform"
          >
            Save Buyer
          </button>
        </div>
      )}

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search buyer..."
        className="w-full mb-6 p-2 border border-[#7B3F00] rounded-lg"
      />

      <div className="space-y-4">
        {filteredBrokers.length === 0 ? (
          <p className="text-gray-600">No buyer found.</p>
        ) : (
          filteredBrokers.map((broker) => (
            <div
              key={broker.id}
              className="bg-white border border-[#7B3F00]/30 rounded-lg shadow-md p-4 flex justify-between items-start"
            >
              <div>
                <h2 className="text-xl font-semibold text-[#7B3F00]">
                  {broker.name}
                </h2>
                <p>📞 {broker.contact}</p>
                <p>📍 {broker.address}</p>
                <p>📝 {broker.notes}</p>
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

export default BuyerManagement ;
