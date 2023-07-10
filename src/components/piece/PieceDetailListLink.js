// 상위 컴포넞트에서
// useLink={true} or useLink={reviewList.length > 0 ? true : false}를 통해
// Link to={}를 이용할 컴포넌트를 구별하여 useLink의 전달 유무를 설정
// useLink=false의 경우 Link는 .disabled로 설정

import { useSelector, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";

export default function PieceDetailListLink({ getData, url, title, useLink }) {
  const getedData = useSelector((state) => state.getedData, shallowEqual);

  if (!!getedData) {
    return (
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
            <Link
              className={!useLink ? "disabled" : ""}
              to={useLink ? url : ""}
            >
              조회
            </Link>
          </div>
        </div>
      </li>
    );
  }
}
