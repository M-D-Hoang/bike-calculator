import { Navbar } from "./components/Navbar/Navbar.js";
import { Footer } from "./components/Footer/Footer.js";
import './App.css';
import { HashRouter, Routes, Route } from "react-router-dom";
import { AccelerationCalculator } from './pages/AccelerationCalculator/AccelerationCalculator.js';
import { DistanceCalculator } from "./pages/DistanceCalculator/DistanceCalculator.js";


function App() {
  return (
    <div className="App">
      <HashRouter>
        <Navbar />
        <Routes>
          <Route index element={<AccelerationCalculator/>} />
          <Route path="/time" element={<DistanceCalculator/>} />
        </Routes>
        <Footer />
      </HashRouter>
    </div>
  );
}

export default App;
