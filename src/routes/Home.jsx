import Nav from "../components/navigation/NavBox";
import Header from "../components/header/HeaderBox";
import Footer from "../components/footer/FooterBox";
import Container from "../components/contents/sale/Container";
function Home() {
  return (
    <div>
      <Nav />
      <main id="main">
        <Header />
        <Container />
        <Footer />
      </main>
    </div>
  );
}

export default Home;
