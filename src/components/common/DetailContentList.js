import { BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function DetailContentList({ getData, url, title }) {
  return (
    <li>
      <Link to={url}>
        <h4>{title}</h4>
        <span>
          {title}은 총 {getData && getData.length > 0 ? getData.length : "0"}개
          입니다.
        </span>
        <div className="link">
          상세보기
          <BsArrowRightShort />
        </div>
      </Link>
    </li>
  );
}