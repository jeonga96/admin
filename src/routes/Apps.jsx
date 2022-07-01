import Nav from "../components/navigation/NavBox";
import Header from "../components/header/HeaderBox";
import Footer from "../components/footer/FooterBox";

function Apps() {
  return (
    <div>
      <Nav />
      <main id="main">
        <Header />
        <Footer />
        Home!
      </main>
    </div>
  );
}

export default Apps;
