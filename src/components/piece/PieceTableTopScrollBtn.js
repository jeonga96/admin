import { Link } from "react-scroll";

export default function PieceTableTopScrollBtn({ data, noHover }) {
  return (
    <div
      className={noHover ? "noHover tableTopScrollBtn" : "tableTopScrollBtn"}
    >
      {data.length > 0 &&
        data.map((item, i) => (
          <Link key={i} to={item.idName} spy={true}>
            {item.text}
          </Link>
        ))}
    </div>
  );
}
