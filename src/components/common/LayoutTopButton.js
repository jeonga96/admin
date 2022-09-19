import { Link } from "react-router-dom";

export default function LayoutTopButton({ url, text }) {
  return (
    <li className="smallButton">
      <Link className="buttonLink Link" to={url}>
        {text}
      </Link>
    </li>
  );
}
