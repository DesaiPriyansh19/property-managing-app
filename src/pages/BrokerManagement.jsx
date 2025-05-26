"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertCircle, CheckCircle, Search, Filter, Edit, Trash2, Plus, X } from "lucide-react"
import BrokerAPI from "../services/BrokerApi"

const BrokerManagement = () => {
  // Group options for both the form and filter
  const groupOptions = ["Title Clear Lands", "Dispute Lands", "Govt. Dispute Lands", "FP / NA", "Others"]

  const [Brokers, setBrokers] = useState([])
  const [newBroker, setNewBroker] = useState({
    name: "",
    contact: "",

    workarea: "",
    notes: "",
    groups: [],
  })

  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [groupFilter, setGroupFilter] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editingBroker, setEditingBroker] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBrokers: 0,
  })
  const [counts, setCounts] = useState({
    "Title Clear Lands": 0,
    "Dispute Lands": 0,
    "Govt. Dispute Lands": 0,
    "FP / NA": 0,
    Others: 0,
    "All Brokers": 0,
  })

  // Load Brokers on component mount
  useEffect(() => {
    fetchBrokers()
  }, [])

  // Handle search and filter with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBrokers(1)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, groupFilter])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("")
        setSuccess("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  // Fetch Brokers from API
  const fetchBrokers = async (page = 1) => {
    setLoading(true)
    setError("")

    try {
      const params = {
        page,
        limit: 10,
        ...(searchQuery && { search: searchQuery }),
        ...(groupFilter.length > 0 && { groups: groupFilter.join(",") }),
      }

      const response = await BrokerAPI.getAllBrokers(params)
      setBrokers(response.data || [])
      setPagination(response.pagination || { currentPage: 1, totalPages: 1, totalBrokers: 0 })
      setCounts(response.counts || counts)
    } catch (err) {
      setError(err.message)
      console.error("Error fetching Brokers:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewBroker({ ...newBroker, [name]: value })
    // Clear error when user starts typing
    if (error) setError("")
  }

  // Handle multi-select checkbox changes for groups in the form
  const handleGroupSelectChange = (option) => {
    const updatedGroups = newBroker.groups.includes(option)
      ? newBroker.groups.filter((g) => g !== option)
      : [...newBroker.groups, option]
    setNewBroker({ ...newBroker, groups: updatedGroups })
  }

  // Handle the filtering of Brokers based on selected groups
  const handleGroupFilterChange = (group) => {
    setGroupFilter((prev) => (prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]))
  }

  // Add or update buyer
  const handleSubmitBroker = async () => {
    setError("")
    setSuccess("")

    if (!newBroker.name || !newBroker.contact) {
      setError("Name and contact are required")
      return
    }

    setSubmitLoading(true)

    try {
      if (editingBroker) {
        await BrokerAPI.updateBroker(editingBroker._id, newBroker)
        setSuccess("Buyer updated successfully!")
        setEditingBroker(null)
      } else {
        await BrokerAPI.createBroker(newBroker)
        setSuccess("Buyer created successfully!")
      }

      // Reset form and refresh Brokers
      setNewBroker({
        name: "",
        contact: "",
        workarea: "",
        notes: "",
        groups: [],
      })
      setShowForm(false)
      await fetchBrokers()
    } catch (err) {
      setError(err.message)
      console.error("Error submitting buyer:", err)
    } finally {
      setSubmitLoading(false)
    }
  }

  // Delete a buyer by ID
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this buyer? This action cannot be undone.")) {
      try {
        await BrokerAPI.deleteBroker(id)
        setSuccess("Buyer deleted successfully!")
        await fetchBrokers()
      } catch (err) {
        setError(err.message)
        console.error("Error deleting buyer:", err)
      }
    }
  }

  // Edit a buyer
  const handleEdit = (buyer) => {
    setEditingBroker(buyer)
    setNewBroker({
      name: buyer.name || "",
      contact: buyer.contact || "",
      workarea: buyer.workarea || "",
      notes: buyer.notes || "",
      groups: buyer.groups || [],
    })
    setShowForm(true)
  }

  const handlePageChange = (newPage) => {
    fetchBrokers(newPage)
  }

  const resetForm = () => {
    setNewBroker({
      name: "",
      contact: "",
      workarea: "",
      notes: "",
      groups: [],
    })
    setEditingBroker(null)
    setShowForm(false)
    setError("")
    setSuccess("")
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-slate-300 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Brokers Management</h1>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {/* Add Buyer Button */}
      <button
        onClick={() => {
          if (showForm) {
            resetForm()
          } else {
            setShowForm(true)
          }
        }}
        className="mb-6 bg-gray-700 text-white px-6 py-2 rounded-xl shadow hover:bg-gray-600 transition-all flex items-center gap-2"
      >
        {showForm ? <X size={20} /> : <Plus size={20} />}
        {showForm ? "Cancel" : "Add New Broker"}
      </button>

      {/* Form to add/edit buyer */}
      {showForm && (
        <div className="bg-gray-200 p-6 rounded-xl shadow-xl mb-6 border border-gray-700/30">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">{editingBroker ? "Edit Buyer" : "Add New Buyer"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={newBroker.name}
              onChange={handleInputChange}
              placeholder="Broker Name *"
              className="border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
            <input
              type="text"
              name="contact"
              value={newBroker.contact}
              onChange={handleInputChange}
              placeholder="Contact Number *"
              className="border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
      
            <input
              type="text"
              name="workarea"
              value={newBroker.workarea}
              onChange={handleInputChange}
              placeholder="Work Area"
              className="border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>

          <textarea
            name="notes"
            value={newBroker.notes}
            onChange={handleInputChange}
            placeholder="Notes"
            rows={3}
            className="border border-gray-700 p-3 rounded-lg w-full my-4 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />

          {/* Group Checkboxes (Multi-select in Form) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Interested Groups:</label>
            <div className="flex flex-wrap gap-4">
              {groupOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    checked={newBroker.groups.includes(option)}
                    onChange={() => handleGroupSelectChange(option)}
                    className="h-4 w-4 border-gray-400 rounded"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSubmitBroker}
              disabled={submitLoading}
              className="bg-gray-700 text-white px-6 py-2 rounded-xl hover:bg-gray-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading && <Loader2 className="animate-spin" size={16} />}
              {editingBroker ? "Update Broker" : "Save Broker"}
            </button>

            <button
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="flex flex-col gap-6 p-6 bg-gray-200 rounded-lg shadow-lg mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Brokers by name, contact, work area, or notes..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        </div>

        {/* Group Filters */}
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-700" />
            <p className="text-gray-700 font-semibold text-lg">Filter by Groups:</p>
          </div>
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
          {groupFilter.length > 0 && (
            <button onClick={() => setGroupFilter([])} className="text-sm text-red-600 hover:text-red-800 underline">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(counts).map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-1">{key}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">Loading Brokers...</span>
        </div>
      ) : (
        <>
          {/* Display the Brokers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {Brokers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Brokers found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || groupFilter.length > 0
                    ? "Try adjusting your search or filter criteria"
                    : "Start by adding your first broker"}
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all"
                >
                  Add Your First Broker
                </button>
              </div>
            ) : (
              Brokers.map((buyer) => (
                <div
                  key={buyer._id}
                  className="bg-white min-h-[180px] border border-gray-200 rounded-xl shadow-sm p-5 flex justify-between items-start hover:shadow-md transition-shadow duration-300"
                >
                  <div className="space-y-2 flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">{buyer.name}</h2>
                    <p className="text-sm text-gray-700 flex items-center gap-1">📞 {buyer.contact}</p>
                  
                    {buyer.workarea && (
                      <p className="text-sm text-gray-700 flex items-center gap-1">🏢 {buyer.workarea}</p>
                    )}
                    {buyer.notes && <p className="text-sm text-gray-700 flex items-center gap-1">📝 {buyer.notes}</p>}
                    {buyer.groups && buyer.groups.length > 0 && (
                      <div className="text-sm text-gray-700">
                        <span className="font-medium">🔖 Groups:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {buyer.groups.map((group, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {group}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(buyer)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-all"
                      title="Edit Buyer"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(buyer._id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-all"
                      title="Delete Buyer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Info */}
          {Brokers.length > 0 && (
            <div className="text-center text-gray-600 text-sm mt-4">
              Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
              {Math.min(pagination.currentPage * 10, pagination.totalBrokers)} of {pagination.totalBrokers} Brokers
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BrokerManagement
