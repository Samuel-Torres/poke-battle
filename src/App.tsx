import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.scss";

// page routes:
import PokemonSelection from "./pageRoutes/pokemonSelection";
import Battle from "./pageRoutes/battle";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PokemonSelection />} />
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
