// table이나 상세보기 등 상단에 scroll을 따라다니는 컴포넌트

import { Link } from "react-router-dom";

export default function LayoutTopButton({ url, text, fn, id }) {
  if (!!url) {
    return (
      <li className="smallButton">
        <Link className="buttonLink Link" to={url}>
          {text}
        </Link>
      </li>
    );
  } else if (!!fn) {
    return (
      <li className="smallSubmitButton">
        <button type="button" className="buttonLink Link" id={id} onClick={fn}>
          {text}
        </button>
      </li>
    );
  } else {
    return (
      <li className="smallSubmitButton">
        <button type="submit" className="buttonLink Link">
          {text}
        </button>
      </li>
    );
  }
}
