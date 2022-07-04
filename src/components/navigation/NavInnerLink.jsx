import { Link } from "react-router-dom";
import styled from "styled-components";

import NavPartList from "./NavPartList";

const StyledLink = styled(Link)`
  display: block;
  width: auto;
  height: 100%;
  padding-right: 25px;
  margin-top: 25px;
  margin-left: 30px;
  text-decoration: none;
`;

export default function NavInnerLink({ item }) {
  return (
    <StyledLink to={item.url}>
      <NavPartList item={item} />
    </StyledLink>
  );
}
