import Nav from "../navigation/NavBox";
import Header from "../header/HeaderBox";
import Footer from "../footer/FooterBox";

function MainLayout({ nowTitle, component }) {
  return (
    <div id="wrap">
      <Nav />
      <div id="WrapBox">
        <Header />
        <div className="containerWrap">
          <h2 className="blind">현재 페이지 내용</h2>
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
              {/* <button type="button" className="containerTitleBtn">
                Create Report
              </button> */}
            </div>
            {component}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
