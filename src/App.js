import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import RouterComponent from "./RouterComponent";

function App() {
  const [btn, setBtn] = useState(true);
  const fnBtn = (btn) => {
    setBtn(!btn);
  };
  const screenChange = (event) => {
    const matches = event.matches;
    setBtn(matches);
  };

  useEffect(() => {
    let mql = window.matchMedia("screen and (min-width:992px)");
    mql.addEventListener("change", screenChange);
    return () => mql.removeEventListener("change", screenChange);
  }, []);

  return (
    <div className="App">
      <Router>
        <RouterComponent btn={btn} fnBtn={fnBtn} />
      </Router>
    </div>
  );
}

export default App;
