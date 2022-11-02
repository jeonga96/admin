import Nav from "../navigation/NavBox";
import Header from "../header/HeaderBox";
import Footer from "../footer/FooterBox";

export default function LayoutMain({ nowTitle, component }) {
  return (
    <div id="wrap">
      <Nav />
      <div>
        <Header />
        <section className="containerWrap">
          <h2>{nowTitle}</h2>
          <div className="contentBox">{component}</div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
