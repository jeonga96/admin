import { useState } from "react";
import { Link as RRDLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import AnimateHeight from "react-animate-height";

import NavPartList from "./NavPartList";

const Link = ({ children, isActive, ...props }) => {
  return <RRDLink {...props}>{children}</RRDLink>;
};
const NavInnerButton = styled.button`
  width: 100%;
  height: auto;
  padding: 0;
  padding-right: 25px;
  margin-top: 25px;
  margin-left: 30px;
  text-align: left;

  .sub_list {
    ul {
      width: 180px;
      margin-left: 30px;
      padding-bottom: 5px;
    }
    li {
      width: 100%;
      height: auto;
      line-height: 41px;
    }
    // NavInner Name
    & > div {
      position: relative;
    }
    // arrow
    & > div:first-child:after,
    & > div:first-child::after {
      display: block;
      content: "";
      position: absolute;
      right: 20px;
      top: 10px;
      width: 7px;
      height: 7px;
      border-top: 1px solid ${({ theme }) => theme.colors.pointGray};
      border-left: 1px solid ${({ theme }) => theme.colors.pointGray};
      transform: rotate(135deg);
      transition: all 0.3s ease-in;
    }
  }

  .sub_list_show {
    width: 100%;
    // arrow
    & > div:first-child:after,
    & > div:first-child::after {
      transform: rotate(225deg);
    }
  }
`;

const StyledSubLink = styled(Link)`
  text-decoration: none;
  font-family: ${({ theme }) => theme.font.point};
  font-size: 14px;
  color: ${(props) => (props.isActive ? "#64C5B1" : "#101038")};
`;

function NavInnerSub({ item }) {
  const { pathname } = useLocation();
  const [height, setHeight] = useState(0);
  const [more, setMore] = useState(false);
  const onClickMore = () => {
    setMore(!more);
    setHeight(height === 0 ? "auto" : 0);
  };

  return (
    <NavInnerButton
      aria-expanded={height !== 0}
      aria-controls="example-panel"
      onClick={onClickMore}
    >
      <div className={more ? "sub_list sub_list_show" : "sub_list"}>
        <NavPartList item={item} />
        <AnimateHeight id="example-panel" duration={300} height={height}>
          <ul>
            {item.subNav.map((item, key) => (
              <li key={key}>
                <StyledSubLink to={item.url} isActive={pathname === item.url}>
                  {item.subName}
                </StyledSubLink>
              </li>
            ))}
          </ul>
        </AnimateHeight>
      </div>
    </NavInnerButton>
  );
}
export default NavInnerSub;
