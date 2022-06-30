import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Apps from "./routes/Apps";
import Uikits from "./routes/Uikits";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/uikits" element={<Uikits />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
