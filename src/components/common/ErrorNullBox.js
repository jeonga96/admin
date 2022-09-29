// import LayoutTopButton from "./LayoutTopButton";
// import { useParams } from "react-router-dom";

export default function ErrorNullBox() {
  // let { cid } = useParams();
  return (
    <section className="tableWrap">
      {/* <ul className="tableTopWrap">
        <LayoutTopButton url={`/company/${cid}`} text="뒤로가기" />
      </ul> */}
      <h3 className="blind">table</h3>
      <div className="paddingBox commonBox">
        <div className="nullBox">데이터가 없습니다.</div>
      </div>
    </section>
  );
}
