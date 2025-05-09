import { useState } from 'react';
import NotesApp from '../components/NotesApp';
import SubComponent2 from '../components/SubComponent2';
import SubComponent3 from '../components/SubComponent3';
import SubComponent4 from '../components/SubComponent4';

const NotesPage = () => {
  const [activeTab, setActiveTab] = useState('notes');

  const renderComponent = () => {
    switch (activeTab) {
      case 'notes':
        return <NotesApp />;
      case 'second':
        return <SubComponent2 />;
      case 'third':
        return <SubComponent3 />;
      case 'fourth':
        return <SubComponent4 />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-300">
    <div className="flex justify-center gap-4 p-4 bg-gray-300">
      <button
        className={`px-4 py-2 rounded-lg ${activeTab === 'notes' ? 'bg-gray-400 border-2  border-gray-700' : 'bg-gray-700'} text-white hover:bg-gray-800`}
        onClick={() => setActiveTab('notes')}
      >
        Notes
      </button>
      <button
        className={`px-4 py-2 rounded-lg ${activeTab === 'second' ? 'bg-gray-400 border-gray-700' : 'bg-gray-700'} text-white hover:bg-gray-800`}
        onClick={() => setActiveTab('second')}
      >
        Second
      </button>
      <button
        className={`px-4 py-2 rounded-lg ${activeTab === 'third' ? 'bg-gray-400 border-gray-700' : 'bg-gray-700'} text-white hover:bg-gray-800`}
        onClick={() => setActiveTab('third')}
      >
        Third
      </button>
      <button
        className={`px-4 py-2 rounded-lg ${activeTab === 'fourth' ? 'bg-gray-400 border-gray-700' : 'bg-gray-700'} text-white hover:bg-gray-800`}
        onClick={() => setActiveTab('fourth')}
      >
        Fourth
      </button>
    </div>
    <div className="p-4">
      {renderComponent()}
    </div>
  </div>
  );
};

export default NotesPage;
