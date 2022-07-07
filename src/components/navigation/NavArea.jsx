// import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import NavInnerSub from "./NavInnerSub";
import NavInnerLink from "./NavInnerLink";

function NavBox() {
  const subLinkData = "./data/nav.json";
  const [data, setData] = useState([]);
  const axiosData = async () => {
    const jsonData = await axios.get(subLinkData);
    setData(jsonData.data);
  };
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
