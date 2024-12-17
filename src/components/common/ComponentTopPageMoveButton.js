import { Link } from "react-router-dom";

export default function ComponentTopPageMoveButton(id, lastid, route) {
  if (id == 1) {
    return (
      // <LayoutTopButton url={`/${route}/${id * 1 + 1}`} text="다음 관리번호" />
      <li className="smallButton">
        <Link className="Link" reloadDocument to={`/${route}/${id * 1 + 1}`}>
          다음 관리번호
        </Link>
      </li>
    );
  } else if (lastid == id) {
    return (
      // <LayoutTopButton url={`/${route}/${id * 1 - 1}`} text="이전 관리번호" />
      <li className="smallButton">
        <Link className="Link" reloadDocument to={`/${route}/${id * 1 - 1}`}>
          이전 관리번호
        </Link>
      </li>
    );
  } else {
    return (
      // <LayoutTopButton
      //   url={`/${route}/${id * 1 - 1}`}
      //   text="이전 관리번호"
      //   secondUrl={`/${route}/${id * 1 + 1}`}
      //   secondText="다음 관리번호"
      // />
      <li className="smallTwoButton">
        <Link className="Link" reloadDocument to={`/${route}/${id * 1 - 1}`}>
          이전 관리번호
        </Link>
        <Link className="Link" reloadDocument to={`/${route}/${id * 1 + 1}`}>
          다음 관리번호
        </Link>
      </li>
    );
  }
}
