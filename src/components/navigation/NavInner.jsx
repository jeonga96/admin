// import { NavLink } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const NavContentInner = styled.div`
  width: 100%;
  height: auto;
  background-color: #eee;
`;
function NavBox() {
  return (
    <NavContentInner>
      <ul>
        {/* <li>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? "red" : "black",
            })}
          >
            Home
          </NavLink>
        </li> */}
      </ul>
    </NavContentInner>
  );
}
export default NavBox;
