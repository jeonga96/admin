import Nav from "../components/navigation/NavBox";
import Header from "../components/header/HeaderBox";
import Footer from "../components/footer/FooterBox";
function Home() {
  return (
    <div>
      <Nav />
      <main>
        <Header />
        <Footer />
        Home!
      </main>
    </div>
  );
}

export default Home;
