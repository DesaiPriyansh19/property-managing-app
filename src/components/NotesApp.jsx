import { useState } from 'react';

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');

  const addNote = () => {
    if (input.trim()) {
      setNotes([{ id: Date.now(), text: input }, ...notes]);
      setInput('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">My Notes</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a new note..."
          className="flex-1 border px-4 py-2 rounded"
        />
        <button
          onClick={addNote}
          className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li key={note.id} className="p-4 bg-gray-100 rounded shadow-sm">
            {note.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesApp;
