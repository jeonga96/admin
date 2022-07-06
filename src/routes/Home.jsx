import { useState } from "react";

import Nav from "../components/navigation/NavBox";
import Header from "../components/header/HeaderBox";
import Footer from "../components/footer/FooterBox";
import Container from "../components/contents/Container";
function Home() {
  const [btn, setBtn] = useState(true);
  const fnBtn = (btn) => {
    setBtn(!btn);
    // setBtn(false);
    // setBtn(true);
  };

  return (
    <div id="wrap">
      <Nav btn={btn} fnBtn={fnBtn} />
      <div id="WrapBox">
        <Header btn={btn} fnBtn={fnBtn} />
        <Container />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
