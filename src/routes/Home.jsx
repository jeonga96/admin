import { useState } from "react";

import Nav from "../components/navigation/NavBox";
import Header from "../components/header/HeaderBox";
import Footer from "../components/footer/FooterBox";
import Container from "../components/contents/sale/Container";
function Home() {
  const [btn, setBtn] = useState(true);
  const fnBtn = (btn) => {
    setBtn(!btn);
  };
  return (
    <div id="wrap">
      <Nav btn={btn} fnBtn={fnBtn} />
      <main id="main">
        <Header btn={btn} fnBtn={fnBtn} />
        <Container />
        <Footer />
      </main>
    </div>
  );
}

export default Home;
