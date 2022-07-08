import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import Tr from "../common/TabelTr";

function Revenue() {
  const trArr = [1, 2, 3, 4, 5, 6];
  return (
    <section className="revenue">
      <div className="revenueSaleBox">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>비고</th>
              <th>작성날짜</th>
            </tr>
          </thead>
          <tbody className="revenueSaleTbody">
            {trArr.map((item, key) => (
              <Tr key={key} item={item} />
            ))}
          </tbody>
        </table>
        <Link to="table" className="link tabelLink">
          <span>More view</span>
          <i>
            <BsArrowRightShort />
          </i>
        </Link>
      </div>
    </section>
  );
}

export default Revenue;
