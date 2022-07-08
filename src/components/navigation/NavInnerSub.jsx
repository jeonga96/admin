import { useState } from "react";
import { Link as RRDLink, useLocation } from "react-router-dom";
import AnimateHeight from "react-animate-height";

import NavPartList from "./NavPartList";

const Link = ({ children, isActive, ...props }) => {
  return <RRDLink {...props}>{children}</RRDLink>;
};

function NavInnerSub({ item }) {
  const { pathname } = useLocation();
  const [height, setHeight] = useState(0);
  const [more, setMore] = useState(false);

  const onClickMore = () => {
    setMore(!more);
    setHeight(height === 0 ? "auto" : 0);
  };

  return (
    <button
      type="button"
      aria-expanded={height !== 0}
      aria-controls="example-panel"
      onClick={onClickMore}
      className="navInnerSub"
    >
      <div className={more ? "navSubList sub_show_btn" : "navSubList"}>
        <NavPartList item={item} />
        <AnimateHeight id="example-panel" duration={300} height={height}>
          <ul>
            {item.subNav.map((item, key) => (
              <li key={key}>
                <Link
                  to={item.url}
                  className="subLink link"
                  style={{
                    color: pathname === item.url ? "#64C5B1" : "#101038",
                  }}
                >
                  {item.subName}
                </Link>
              </li>
            ))}
          </ul>
        </AnimateHeight>
      </div>
    </button>
  );
}
export default NavInnerSub;
