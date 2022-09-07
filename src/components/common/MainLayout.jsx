import Nav from "../navigation/NavBox";
import Header from "../header/HeaderBox";
import Footer from "../footer/FooterBox";

export default function MainLayout({ nowTitle, component }) {
  return (
    <div id="wrap">
      <Nav />
      <div id="WrapBox">
        <Header />
        <section className="containerWrap">
          <h2 className="blind">{nowTitle}</h2>
          <div className="contentBox">
            <div className="contentTitleWrap">
              <div className="ContainertitleText">
                <h3>{nowTitle}</h3>
                {/* <ol className="ContainerTitlebreadcrumb">
              <li className="breadcrumbPrev">
                <span>{breadcrumb1}</span>
              </li>
              <li className="breadcrumbPrev">
                <span>{breadcrumb2}</span>
              </li>
              <li>
                <span>{breadcrumb3}</span>
              </li>
            </ol> */}
              </div>
            </div>
            {component}
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
