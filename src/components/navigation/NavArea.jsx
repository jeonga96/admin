// import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

import NavInnerSub from "./NavInnerSub";
import NavInnerLink from "./NavInnerLink";

const NavContentInner = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  ul {
    width: 100%;
    height: auto;
  }
  li {
    width: 250px;
    height: auto;
    min-height: 34px;
    margin-right: 20px;
    ${({ theme }) => theme.media.wideTab} {
      width: 100%;
    }
    /* ${({ theme }) => theme.media.widePc} {
      width: 270px;
    } */
  }
`;

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
    <NavContentInner>
      <h2>메뉴</h2>
      <ul>
        {data.map((item, key) => (
          <li key={key}>
            {item.url && <NavInnerLink item={item} />}
            {item.subNav && <NavInnerSub item={item} />}
          </li>
        ))}
      </ul>
    </NavContentInner>
  );
}
export default NavBox;
