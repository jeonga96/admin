import { Link } from "react-scroll";

export default function ComponentTableTopScrollBtn({ data }) {
  return (
    <div className="tableTopScrollBtn">
      {data.length > 0 &&
        data.map((item, i) => (
          <Link key={i} to={item.idName} spy={true}>
            {item.text}
          </Link>
        ))}
    </div>
  );
}
