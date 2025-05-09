import { useState } from 'react';
import {
  AiOutlinePlus,
  AiOutlineSearch,
  AiFillEdit,
  AiFillDelete,
  AiOutlineCheck,
  AiOutlineClose,
} from 'react-icons/ai';

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedText, setEditedText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [expandedNoteIds, setExpandedNoteIds] = useState([]);

  const toggleReadMore = (id) => {
    setExpandedNoteIds((prev) =>
      prev.includes(id)
        ? prev.filter((noteId) => noteId !== id)
        : [...prev, id]
    );
  };

  const addNote = () => {
    if (inputTitle.trim() && inputText.trim()) {
      const newNote = {
        id: Date.now(),
        title: inputTitle,
        text: inputText,
        date: new Date().toISOString().split('T')[0],
      };
      setNotes([newNote, ...notes]);
      setInputTitle('');
      setInputText('');
      setShowAddForm(false);
    }
  };

  const cancelAddNote = () => {
    setInputTitle('');
    setInputText('');
    setShowAddForm(false);
  };

  const startEdit = (note) => {
    setEditNoteId(note.id);
    setEditedTitle(note.title);
    setEditedText(note.text);
  };

  const saveEdit = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, title: editedTitle, text: editedText } : note
      )
    );
    setEditNoteId(null);
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = () => {
    setNotes(notes.filter((note) => note.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (searchDate === '' || note.date === searchDate)
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
        📒 My Notes
      </h2>

      {/* Search Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center border rounded-xl px-4 py-2 w-full sm:w-[80%] bg-gray-200 shadow">
          <AiOutlineSearch className="text-gray-400 mr-2" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title..."
            className="flex-1 outline-none bg-transparent"
          />
        </div>

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-gray-100 border-gray-300 focus:ring-2 focus:ring-gray-700 w-full sm:w-auto"
        />
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
    placeholder="Note Text"
    rows="4"
    className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-700 w-full"
  />
  <div className="flex flex-col sm:flex-row gap-4 text-sm">
    <button
      onClick={addNote}
      className="bg-gray-700 text-white px-6 py-3 h-12 rounded-xl hover:bg-gray-900 active:scale-95 transition flex items-center justify-center gap-2"
    >
      <AiOutlinePlus size={20} /> Save Note
    </button>
    <button
      onClick={cancelAddNote}
      className="bg-red-500 text-white px-6 py-3 h-12 rounded-xl hover:bg-red-700 active:scale-95 transition flex items-center justify-center gap-2"
    >
      <AiOutlineClose size={20} /> Cancel Note
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
            className="bg-gray-700 text-white flex justify-center items-center px-6 py-3 rounded-xl hover:bg-gray-900 active:scale-95 transition"
          >
            <AiOutlinePlus size={20} /> Add Note
          </button>
        </div>
      )}

      {/* Notes List */}
      <ul className="space-y-4 text-start">
        {filteredNotes.map((note) => (
          <li
            key={note.id}
            className="bg-gray-200 p-4 rounded-xl shadow relative flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            {editNoteId === note.id ? (
              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows="4"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ) : (
              <div className="flex-1 space-y-1">
                <h4 className="text-lg font-semibold">{note.title}</h4>
                <p
                  className={`text-gray-800 break-words whitespace-normal ${
                    expandedNoteIds.includes(note.id) ? '' : 'line-clamp-2'
                  }`}
                >
                  {note.text}
                </p>
                <button
                  onClick={() => toggleReadMore(note.id)}
                  className="text-blue-500 hover:underline"
                >
                  {expandedNoteIds.includes(note.id)
                    ? 'Show less'
                    : 'Read more'}
                </button>
                <p className="text-xs text-gray-700">Date: {note.date}</p>
              </div>
            )}

            <div className="absolute top-2 right-2 flex gap-2">
              {editNoteId === note.id ? (
                <>
                  <button
                    onClick={() => saveEdit(note.id)}
                    className="text-green-600 hover:text-green-400 font-bold text-2xl"
                    title="Save"
                  >
                    <AiOutlineCheck size={25} />
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
    onClick={() => confirmDelete(note.id)}
    className="text-red-500 hover:text-red-700 h-6 w-6 flex items-center justify-center"
    title="Delete"
  >
    <AiFillDelete className="h-4 w-4" />
  </button>
</>

              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-200 p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this note?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesApp;
