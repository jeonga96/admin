import styled from "styled-components";

import Title from "./ContainerAreaTitle";
import Content from "./ContainerContentArea";
import Button from "../form/WidthWhiteButton";

const WrapContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  background-color: ${({ theme }) => theme.colors.bgGray};
  &:before,
  &::before {
    position: absolute;
    content: "";
    display: block;
    width: 100%;
    height: 160px;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;
const WrapContentBox = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  padding: 15px;
  ${({ theme }) => theme.media.widePc} {
    padding: 30px;
  }
`;
const WrapTitleArea = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

function Container() {
  return (
    <WrapContainer>
      <h2>현재 페이지 내용</h2>
      <WrapContentBox>
        <WrapTitleArea>
          <Title />
          <Button />
        </WrapTitleArea>
        <Content />
      </WrapContentBox>
    </WrapContainer>
  );
}
export default Container;
