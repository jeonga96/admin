import { BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function PieceDetailListLink({ getData, url, title, inCommon }) {
  return inCommon ? (
    <li>
      <div>
        <span>{title}</span>
        <div className="detailContentBox">
          <span>
            {!!getData && !!getData.totalElements
              ? getData.totalElements
              : getData && getData.length > 0
              ? getData.length
              : "0"}
            개
          </span>
          <Link to={url}>조회</Link>
        </div>
      </div>
    </li>
  ) : (
    <li>
      <Link to={url}>
        <h4>{title}</h4>
        <span>
          {!!getData && !!getData.totalElements
            ? getData.totalElements
            : getData && getData.length > 0
            ? getData.length
            : "0"}
          개
        </span>
        <div className="link">
          상세보기
          <BsArrowRightShort />
        </div>
      </Link>
    </li>
  );
}
