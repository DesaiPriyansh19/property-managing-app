import { useState } from 'react';
import NotesApp from '../components/NotesApp';
import SubComponent2 from '../components/SubComponent2';
import SubComponent3 from '../components/SubComponent3';
import SubComponent4 from '../components/SubComponent4';
import companyLogo from "../../public/WhatsApp Image 2025-05-01 at 16.53.33_ce5a9459.jpg";
const NotesPage = () => {
  const [activeTab, setActiveTab] = useState('notes');

  const renderComponent = () => {
    switch (activeTab) {
      case 'rd':
        return <SubComponent4 /> ;
      case 'temple':
        return <SubComponent2 />;
      case 'myproperies':
        return <SubComponent3 />;
      case 'notes':
        return  <NotesApp />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-300">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-center mb-10 ml-3 pt-5">
        <div className="flex flex-row items-center gap-4 sm:gap-6 mb-10 xl:mb-0">
     
          {/* Logo */}
          <div className="rounded-2xl shadow-lg">
            <img
              src={companyLogo}
              alt="Company Logo"
              className="w-20 h-20 sm:w-24 xl:w-[12rem] sm:h-24 xl:h-[12rem] rounded-xl object-cover shadow-md bg-white"
            />
          </div>
      
          {/* Heading centered without affecting image */}
          <div className="flex-1 flex justify-center sm:justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-wide text-gray-600 text-center lg:mt-7">
              RD Legal Consulting
            </h1>
          </div>
        </div>
      
        
      </div>
      <div className='h-[1.5px] w-full bg-gray-500'></div>
    <div className="flex justify-center gap-4 p-4 bg-gray-300">
      <button
        className={`px-4 py-2 rounded-lg ${activeTab === 'notes' ? 'bg-gray-400 border-[3px] text-black  border-black' : 'bg-gray-700'} text-white `}
        onClick={() => setActiveTab('rd')}
      >
        RD Legal Properties
      </button>
      <button
        className={`px-4 py-2 rounded-lg ${activeTab === 'second' ? 'bg-gray-400 border-[3px] text-black  border-black' : 'bg-gray-700'} text-white `}
        onClick={() => setActiveTab('temple')}
      >
       Temple Properties
      </button>
      <button
        className={`px-4 py-2 rounded-lg ${activeTab === 'third' ? 'bg-gray-400 border-[3px] text-black  border-black' : 'bg-gray-700'} text-white `}
        onClick={() => setActiveTab('myproperies')}
      >
       My properties
      </button>
      <button
        className={`px-4 py-2 rounded-lg ${activeTab === 'fourth' ? 'bg-gray-400 border-[3px] text-black  border-black' : 'bg-gray-700'} text-white `}
        onClick={() => setActiveTab('notes')}
      >
      My Notes
      </button>
    </div>
    <div className="p-4">
      {renderComponent()}
    </div>
  </div>
  );
};

export default NotesPage;
