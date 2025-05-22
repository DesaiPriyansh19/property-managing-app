import { useState } from 'react';
import NotesApp from '../components/NotesApp';
import RdLeagl from '../components/RdLeagl'
import MyProperty from '../components/MyProperty'
import companyLogo from "../../public/WhatsApp Image 2025-05-01 at 16.53.33_ce5a9459.jpg";
import TempleProperty from '../components/TempleProperty';
import { FaHome, FaPlusSquare, FaBuilding, FaWallet, FaLock, FaSignOutAlt } from "react-icons/fa";
const MyWallet = () => {
  const [activeTab, setActiveTab] = useState('notes');

  const renderComponent = () => {
    switch (activeTab) {
      case 'rd':
        return  <RdLeagl/>;
      case 'temple':
        return <TempleProperty/>;
      case 'myproperies':
        return <MyProperty/>;
      case 'notes':
        return  <NotesApp />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-300">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-start items-center mb-5 ml-3 pt-5">
        <div className="flex flex-row items-center gap-4 sm:gap-6 mb-0 xl:mb-0">
     
          {/* Logo */}
          <div className="rounded-2xl shadow-lg ml-10">
            <img
              src={companyLogo}
              alt="Company Logo"
              className="w-20 h-20 sm:w-24 xl:w-[12rem] sm:h-24 xl:h-[12rem] rounded-xl object-cover shadow-md bg-white"
            />
          </div>
      
          {/* Heading centered without affecting image */}
          <div className="flex-1 flex justify-center sm:justify-center ">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-wide text-gray-600 text-center lg:mt-7">
              RD Legal Consulting
            </h1>
          </div>
       
        </div>
      

      </div>

                 <h3 className='flex justify-center items-center gap-4 ml-[4%] mb-[4%] text-3xl font-bold text-gray-700'>My Wallet<FaWallet/> </h3>


      <div className='h-[1.5px] w-[96%] mx-auto bg-gray-500'></div>
   <div className="flex justify-start md:justify-center gap-4 p-4 overflow-x-auto whitespace-nowrap bg-gray-300">
  <button
    className={`px-4 py-2 rounded-lg ${activeTab === 'rd' ? 'bg-gray-500 border-[3px] text-black border-black' : 'bg-gray-700'} text-white`}
    onClick={() => setActiveTab('rd')}
  >
    RD Legal Properties
  </button>
  <button
    className={`px-4 py-2 rounded-lg ${activeTab === 'temple' ? 'bg-gray-500 border-[3px] text-black border-black' : 'bg-gray-700'} text-white`}
    onClick={() => setActiveTab('temple')}
  >
    Temple Properties
  </button>
  <button
    className={`px-4 py-2 rounded-lg ${activeTab === 'myproperies' ? 'bg-gray-500 border-[3px] text-black border-black' : 'bg-gray-700'} text-white`}
    onClick={() => setActiveTab('myproperies')}
  >
    My properties
  </button>
  <button
    className={`px-4 py-2 rounded-lg ${activeTab === 'notes' ? 'bg-gray-500 border-[3px] text-black border-black' : 'bg-gray-700'} text-white`}
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

export default MyWallet;
