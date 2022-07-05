import styled from "styled-components";
const WrapTitleDiv = styled.div`
  width: 100px;
  h3 {
    width: auto;
    height: auto;
    font-family: ${({ theme }) => theme.font.point};
    font-size: 26px;
    line-height: 1.2;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
  span {
    color: ${({ theme }) => theme.colors.white};
  }
`;
const BreadcrumbOl = styled.ol`
  width: 100%;
  display: flex;
  li {
    width: auto;
    span {
      font-size: 14px;
    }
  }
  .breadcrumbPrev:after,
  .breadcrumbPrev::after {
    content: ">";
    color: ${({ theme }) => theme.colors.white};
    margin: 0 5px;
    font-size: 14px;
  }
`;
function ContainerTitle() {
  return (
    <WrapTitleDiv>
      <h3>
        <span>Dashboard</span>
      </h3>
      <BreadcrumbOl>
        <li className="breadcrumbPrev">
          <span>Salessa</span>
        </li>
        <li className="breadcrumbPrev">
          <span>Dashboard</span>
        </li>
        <li>
          <span>Sales</span>
        </li>
      </BreadcrumbOl>
    </WrapTitleDiv>
  );
}
export default ContainerTitle;
