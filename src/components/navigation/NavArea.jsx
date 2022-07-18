// import { NavLink } from "react-router-dom";
import { axiosGetData } from "../../service/importData";
import { navUrl } from "../../service/string";
import { useState, useEffect } from "react";

import NavInnerSub from "./NavInnerSub";
import NavInnerLink from "./NavInnerLink";

function NavBox() {
  const [data, setData] = useState([]);
  function axiosData() {
    axiosGetData(navUrl).then((res) => setData(res));
  }
  useEffect(() => {
    axiosData();
  }, []);

  return (
    <div className="navBottom">
      <h2 className="blind">카테고리 보기</h2>
      <ul>
        {data.map((item, key) => (
          <li key={key}>
            {item.url && <NavInnerLink item={item} />}
            {item.subNav && <NavInnerSub item={item} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default NavBox;
