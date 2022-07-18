import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Home from "./screens/Home";
import Login from "./screens/Login";
import Table from "./screens/Table";
import { getSession } from "./service/importData";
import { ISLOGIN } from "./service/string";

function App() {
  const [btn, setBtn] = useState(true);
  // const location = useLocation();
  // const navigate = useNavigate();
  const fnBtn = (btn) => {
    setBtn(!btn);
  };
  const screenChange = (event) => {
    const matches = event.matches;
    setBtn(matches);
  };
  const userCheck = () => {
    const user = getSession(ISLOGIN);
    if (!user) {
      // navigate("/login");
      console.log("아아");
      return;
    }
  };
  useEffect(() => {
    // console.log(location);
    let mql = window.matchMedia("screen and (min-width:992px)");
    mql.addEventListener("change", screenChange);
    // userCheck();
    return () => mql.removeEventListener("change", screenChange);
  }, []);

  // useEffect(() => {
  //   userCheck();
  // }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path={`${process.env.PUBLIC_URL}/`}
            element={<Home btn={btn} fnBtn={fnBtn} />}
          />
          <Route path={`${process.env.PUBLIC_URL}/login`} element={<Login />} />
          <Route
            path={`${process.env.PUBLIC_URL}/table`}
            element={<Table btn={btn} fnBtn={fnBtn} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
