import { Link } from "react-router-dom";

export default function LayoutTopButton({ url, text, fn }) {
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
        <button type="button" className="buttonLink Link" onClick={fn}>
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
