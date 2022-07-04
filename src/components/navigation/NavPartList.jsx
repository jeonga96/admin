import styled from "styled-components";

const WrapNavLi = styled.div`
  width: 100%;
  height: auto;
  .nav_icon {
    display: inline-block;
    width: 34px;
    height: 34px;
    padding-top: 10px;
    img {
      width: 14px;
      height: 14px;
    }
  }
  .nav_name {
    font-family: ${({ theme }) => theme.font.point};
    color: ${({ theme }) => theme.colors.black};
    font-size: 16px;
  }
`;
function NavPartList({ item }) {
  return (
    <WrapNavLi>
      <div className="nav_icon">
        <img src={item.icon} alt={item.name} />
      </div>
      <span className="nav_name">{item.name}</span>
    </WrapNavLi>
  );
}
export default NavPartList;
