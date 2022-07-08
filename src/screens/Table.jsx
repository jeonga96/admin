import Nav from "../components/navigation/NavBox";
import Header from "../components/header/HeaderBox";
import Footer from "../components/footer/FooterBox";
import Container from "../components/common/Container";
import TablePages from "../pages/TablePages";

function Table({ btn, fnBtn }) {
  return (
    <div id="wrap">
      <Nav btn={btn} fnBtn={fnBtn} />
      <div id="WrapBox">
        <Header btn={btn} fnBtn={fnBtn} />
        <Container
          nowTitle="table"
          breadcrumb1="sales"
          breadcrumb2="Dashboard"
          breadcrumb3="table"
          component={<TablePages />}
        />
        <Footer />
      </div>
    </div>
  );
}
export default Table;
