import { Link } from "react-router-dom";

export default function LayoutTopButton({ url, text }) {
  if (!!url) {
    return (
      <li className="smallButton">
        <Link className="buttonLink Link" to={url}>
          {text}
        </Link>
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
