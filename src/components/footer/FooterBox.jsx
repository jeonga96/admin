import styled from "styled-components";
const FooterWrap = styled.header`
  width: 100%;
  height: 78px;
  background-color: #20c997;
  span {
    display: inline-block;
    width: 100%;
    height: auto;
    color: #fff;
    line-height: 78px;
    text-align: center;
  }
`;
function FooterBox() {
  return (
    <FooterWrap>
      <span>2020 © Influence - Designed by Dashboard</span>
    </FooterWrap>
  );
}
export default FooterBox;
