// import { NavLink } from "react-router-dom";
import { servicesGetData } from "../../Services/importData";
import { navUrl } from "../../Services/string";
import { useState, useEffect } from "react";

import NavInnerSub from "./NavInnerSub";
import NavInnerLink from "./NavInnerLink";

export default function NavBox() {
  const [data, setData] = useState([]);
  function axiosData() {
    servicesGetData(navUrl).then((res) => setData(res));
    // axiosGetData("../../data/nav.json").then((res) => setData(res));
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
