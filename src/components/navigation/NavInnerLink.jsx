import { Link } from "react-router-dom";

import NavPartList from "./NavPartList";

export default function NavInnerLink({ item }) {
  return (
    <Link className="link navInnerSub" to={item.url}>
      <NavPartList item={item} />
    </Link>
  );
}
