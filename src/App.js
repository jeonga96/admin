import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
// import Apps from "./routes/Apps";
// import Uikits from "./routes/Uikits";
import GlobalStyles from "./GlobalStyles";

function App() {
  return (
    <div className="App">
      <Router>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/apps" element={<Apps />} />
          <Route path="/uikits" element={<Uikits />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
