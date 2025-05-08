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
    <div className="w-full min-h-screen bg-gray-100">
      <div className="flex justify-center gap-4 p-4 bg-white shadow">
        <button className="btn" onClick={() => setActiveTab('notes')}>Notes</button>
        <button className="btn" onClick={() => setActiveTab('second')}>Second</button>
        <button className="btn" onClick={() => setActiveTab('third')}>Third</button>
        <button className="btn" onClick={() => setActiveTab('fourth')}>Fourth</button>
      </div>
      <div className="p-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default NotesPage;
