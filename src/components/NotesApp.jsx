"use client"

import { useState, useEffect } from "react"
import {
  AiOutlinePlus,
  AiOutlineSearch,
  AiFillEdit,
  AiFillDelete,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineCalendar,
} from "react-icons/ai"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import NotesAPI from "../services/NotesApi"

const NotesApp = () => {
  const [notes, setNotes] = useState([])
  const [inputTitle, setInputTitle] = useState("")
  const [inputText, setInputText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editNoteId, setEditNoteId] = useState(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedText, setEditedText] = useState("")
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [expandedNoteIds, setExpandedNoteIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNotes: 0,
  })

  // Load notes on component mount
  useEffect(() => {
    fetchNotes()
  }, [])

  // Handle search and date filter with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchNotes(1)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, dateFrom, dateTo])

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

  // Fetch notes from API
  const fetchNotes = async (page = 1) => {
    setLoading(true)
    setError("")

    try {
      const params = {
        page,
        limit: 10,
        ...(searchQuery && { search: searchQuery }),
        ...(dateFrom && { createdFrom: dateFrom }),
        ...(dateTo && { createdTo: dateTo }),
      }

      const response = await NotesAPI.getAllNotes(params)
      setNotes(response.data || [])
      setPagination(response.pagination || { currentPage: 1, totalPages: 1, totalNotes: 0 })
    } catch (err) {
      setError(err.message)
      console.error("Error fetching notes:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleReadMore = (id) => {
    setExpandedNoteIds((prev) => (prev.includes(id) ? prev.filter((noteId) => noteId !== id) : [...prev, id]))
  }

  const addNote = async () => {
    if (inputTitle.trim() && inputText.trim()) {
      setSubmitLoading(true)
      setError("")
      setSuccess("")

      try {
        const noteData = {
          title: inputTitle.trim(),
          note: inputText.trim(),
        }

        await NotesAPI.createNote(noteData)
        setSuccess("Note created successfully!")

        // Reset form and refresh notes
        setInputTitle("")
        setInputText("")
        setShowAddForm(false)
        await fetchNotes()
      } catch (err) {
        setError(err.message)
        console.error("Error creating note:", err)
      } finally {
        setSubmitLoading(false)
      }
    } else {
      setError("Please fill in both title and note content")
    }
  }

  const cancelAddNote = () => {
    setInputTitle("")
    setInputText("")
    setShowAddForm(false)
    setError("")
  }

  const startEdit = (note) => {
    setEditNoteId(note._id)
    setEditedTitle(note.title)
    setEditedText(note.note)
  }

  const saveEdit = async (id) => {
    if (editedTitle.trim() && editedText.trim()) {
      setSubmitLoading(true)
      setError("")
      setSuccess("")

      try {
        const noteData = {
          title: editedTitle.trim(),
          note: editedText.trim(),
        }

        await NotesAPI.updateNote(id, noteData)
        setSuccess("Note updated successfully!")

        // Update local state
        setNotes(notes.map((note) => (note._id === id ? { ...note, title: editedTitle, note: editedText } : note)))
        setEditNoteId(null)
      } catch (err) {
        setError(err.message)
        console.error("Error updating note:", err)
      } finally {
        setSubmitLoading(false)
      }
    } else {
      setError("Please fill in both title and note content")
    }
  }

  const confirmDelete = (id) => {
    setConfirmDeleteId(id)
  }

  const handleDelete = async () => {
    try {
      await NotesAPI.deleteNote(confirmDeleteId)
      setSuccess("Note deleted successfully!")

      // Remove from local state
      setNotes(notes.filter((note) => note._id !== confirmDeleteId))
      setConfirmDeleteId(null)
    } catch (err) {
      setError(err.message)
      console.error("Error deleting note:", err)
    }
  }

  const handlePageChange = (newPage) => {
    fetchNotes(newPage)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setDateFrom("")
    setDateTo("")
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">📒 My Notes</h2>

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

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center border rounded-xl px-4 py-2 w-full sm:w-[60%] bg-gray-200 shadow">
            <AiOutlineSearch className="text-gray-400 mr-2" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or content..."
              className="flex-1 outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <AiOutlineCalendar className="text-gray-600" size={20} />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 focus:ring-2 focus:ring-gray-700"
              placeholder="From"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 rounded-xl border bg-gray-100 border-gray-300 focus:ring-2 focus:ring-gray-700"
              placeholder="To"
            />
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || dateFrom || dateTo) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Search: "{searchQuery}"</span>
            )}
            {dateFrom && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">From: {dateFrom}</span>
            )}
            {dateTo && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">To: {dateTo}</span>}
            <button onClick={clearFilters} className="text-red-600 hover:text-red-800 text-xs underline ml-2">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Add Note Form */}
      {showAddForm && (
        <div className="bg-emerald-50 p-6 rounded-2xl mb-8 border border-emerald-100 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <AiOutlinePlus size={22} /> Add a New Note
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="Note Title"
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-700"
            />
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Note Content"
              rows="4"
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-700 w-full"
            />
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <button
                onClick={addNote}
                disabled={submitLoading}
                className="bg-gray-700 text-white px-6 py-3 h-12 rounded-xl hover:bg-gray-900 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? <Loader2 className="animate-spin" size={20} /> : <AiOutlinePlus size={20} />}
                {submitLoading ? "Saving..." : "Save Note"}
              </button>
              <button
                onClick={cancelAddNote}
                className="bg-red-500 text-white px-6 py-3 h-12 rounded-xl hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <AiOutlineClose size={20} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Button */}
      {!showAddForm && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gray-700 text-white flex justify-center items-center px-6 py-3 rounded-xl hover:bg-gray-900 active:scale-95 transition gap-2"
          >
            <AiOutlinePlus size={20} /> Add Note
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin" size={32} />
          <span className="ml-2">Loading notes...</span>
        </div>
      ) : (
        <>
          {/* Notes List */}
          <ul className="space-y-4 text-start">
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No notes found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || dateFrom || dateTo
                    ? "Try adjusting your search or filter criteria"
                    : "Start by adding your first note"}
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all"
                >
                  Add Your First Note
                </button>
              </div>
            ) : (
              notes.map((note) => (
                <li
                  key={note._id}
                  className="bg-gray-200 p-4 rounded-xl shadow relative flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  {editNoteId === note._id ? (
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Note title"
                      />
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        rows="4"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Note content"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 space-y-1">
                      <h4 className="text-lg font-semibold">{note.title}</h4>
                      <p
                        className={`text-gray-800 break-words whitespace-normal ${
                          expandedNoteIds.includes(note._id) ? "" : "line-clamp-2"
                        }`}
                      >
                        {note.note}
                      </p>
                      {note.note && note.note.length > 100 && (
                        <button
                          onClick={() => toggleReadMore(note._id)}
                          className="text-blue-500 hover:underline text-sm"
                        >
                          {expandedNoteIds.includes(note._id) ? "Show less" : "Read more"}
                        </button>
                      )}
                      <p className="text-xs text-gray-700">Created: {formatDate(note.createdAt)}</p>
                      {note.updatedAt !== note.createdAt && (
                        <p className="text-xs text-gray-600">Updated: {formatDate(note.updatedAt)}</p>
                      )}
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-2">
                    {editNoteId === note._id ? (
                      <>
                        <button
                          onClick={() => saveEdit(note._id)}
                          disabled={submitLoading}
                          className="text-green-600 hover:text-green-400 font-bold text-2xl disabled:opacity-50"
                          title="Save"
                        >
                          {submitLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                          ) : (
                            <AiOutlineCheck size={25} />
                          )}
                        </button>
                        <button
                          onClick={() => setEditNoteId(null)}
                          className="text-red-600 hover:text-red-400 font-bold text-2xl"
                          title="Cancel"
                        >
                          <AiOutlineClose size={25} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(note)}
                          className="text-blue-500 hover:text-blue-700 h-6 w-6 flex items-center justify-center"
                          title="Edit"
                        >
                          <AiFillEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(note._id)}
                          className="text-red-500 hover:text-red-700 h-6 w-6 flex items-center justify-center"
                          title="Delete"
                        >
                          <AiFillDelete className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>

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
          {notes.length > 0 && (
            <div className="text-center text-gray-600 text-sm mt-4">
              Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
              {Math.min(pagination.currentPage * 10, pagination.totalNotes)} of {pagination.totalNotes} notes
            </div>
          )}
        </>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-200 p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this note? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotesApp
