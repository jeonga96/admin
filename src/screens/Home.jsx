import Nav from "../components/navigation/NavBox";
import Header from "../components/header/HeaderBox";
import Footer from "../components/footer/FooterBox";
import Container from "../components/common/Container";
import SalePages from "../pages/SalesPages";

function Home({ btn, fnBtn }) {
  return (
    <div id="wrap">
      <Nav btn={btn} fnBtn={fnBtn} />
      <div id="WrapBox">
        <Header btn={btn} fnBtn={fnBtn} />
        <Container
          nowTitle="sales"
          breadcrumb1="sales"
          breadcrumb2="Dashboard"
          breadcrumb3="sales"
          component={<SalePages />}
        />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
