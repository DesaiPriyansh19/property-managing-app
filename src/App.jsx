// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute"; // Capitalize if it’s a component
import "./App.css";
import BrokerManagement from "./pages/BrokerManagement.jsx";
import BuyerManagement from "./pages/BuyersManagment.jsx";
import AllMaps from "./pages/AllMaps.jsx";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/property/:id" element={
            <ProtectedRoute>
              <PropertyDetails />
            </ProtectedRoute>
          } />
          <Route path="/add-property" element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          } />
             <Route path="/brokers" element={
            <ProtectedRoute>
              <BrokerManagement/>
            </ProtectedRoute>
          } />
              <Route path="/buyers" element={
            <ProtectedRoute>
              <BuyerManagement/>
            </ProtectedRoute>
          } />
                   <Route path="/allmaps" element={
            <ProtectedRoute>
              <AllMaps/>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
