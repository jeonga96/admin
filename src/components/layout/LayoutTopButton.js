// // table이나 상세보기 등 상단에 scroll을 따라다니는 컴포넌트
// import { Link } from "react-router-dom";

import { Link } from "react-router-dom";

export default function LayoutTopButton({
  url,
  text,
  fn,
  id,
  style,
  idNum,
  secondUrl,
  secondText,
  isSubmitting,
}) {
  // 로그로 isSubmitting 값 확인

  if (!!url && !!secondUrl) {
    return (
      <li className="smallTwoButton" style={style}>
        <Link className="Link" to={url}>
          {text}
        </Link>
        <Link className="Link" to={secondUrl}>
          {secondText}
        </Link>
      </li>
    );
  } else if (!!url) {
    return (
      <li className="smallButton" style={style}>
        <Link className="Link" to={url}>
          {text}
        </Link>
      </li>
    );
  } else if (!!fn) {
    return (
      <li className="smallSubmitButton" style={style}>
        <button
          type="button"
          className="Link"
          id={id}
          onClick={fn}
          disabled={isSubmitting ? true : false} // !isSubmitting 값에 따라 비활성화 처리
        >
          {text}
        </button>
      </li>
    );
  } else if (!!idNum) {
    return (
      <li className="idNum" style={style}>
        관리번호 : {idNum}
      </li>
    );
  } else {
    return (
      <li className="smallSubmitButton" style={style}>
        <button
          type="submit" // submit 타입인 버튼
          className="Link"
          disabled={isSubmitting ? true : false} // isSubmitting 값에 따라 비활성화 처리
        >
          {text}
        </button>
      </li>
    );
  }
}
