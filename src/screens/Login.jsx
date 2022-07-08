import Nav from "../components/navigation/NavBox";
import Header from "../components/header/HeaderBox";
import Footer from "../components/footer/FooterBox";
import Container from "../components/common/Container";
import LoginPages from "../pages/LoginPages";

function Login({ btn, fnBtn }) {
  return (
    <div id="wrap">
      <Nav btn={btn} fnBtn={fnBtn} />
      <div id="WrapBox">
        <Header btn={btn} fnBtn={fnBtn} />
        <Container
          nowTitle="login"
          breadcrumb1="sales"
          breadcrumb2="Dashboard"
          breadcrumb3="login"
          component={<LoginPages />}
        />
        <Footer />
      </div>
    </div>
  );
}

export default Login;
