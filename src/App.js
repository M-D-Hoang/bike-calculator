import { Navbar } from "./components/Navbar/Navbar.js";
import { Footer } from "./components/Footer/Footer.js";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccelerationCalculator } from './pages/AccelerationCalculator/AccelerationCalculator.js';
import { DistanceCalculator } from "./pages/DistanceCalculator/DistanceCalculator.js";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<AccelerationCalculator/>} />
          <Route path="/time" element={<DistanceCalculator/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
