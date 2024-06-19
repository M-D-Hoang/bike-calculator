import { Navbar } from "./components/Navbar/Navbar.js";
import { TopSpeedGraph } from "./components/TopSpeedGraph/TopSpeedGraph.js";
import { VariableForm } from "./components/VariableForm/VariableForm.js";
import './App.css';
import { useState } from "react";


function App() {
  const [variablesArray, setVariablesArray] = useState({});

  function handleVariables(variablesArray) {
    setVariablesArray(variablesArray);
  }

  return (
    <div className="App">
      <Navbar />
      <div className="main-container">
        <VariableForm submitVariables={handleVariables}/>
        <TopSpeedGraph variablesArray={variablesArray} />

      </div>
    </div>
  );
}

export default App;
