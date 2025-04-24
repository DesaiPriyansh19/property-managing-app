// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import PropertyDetails from "../src/pages/PropertyDetails.jsx"; // 👈 import it
import AddProperty from "../src/pages/AddProperty.jsx";
import "./App.css"
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/property/:id" element={<PropertyDetails />} /> {/* 👈 Add this line */}
        <Route path="/add-property" element={<AddProperty />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
