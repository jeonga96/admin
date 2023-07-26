import Nav from "./NavBox";
import Header from "./HeaderBox";
import Footer from "./FooterBox";

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
