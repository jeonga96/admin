import styled from "styled-components";

const Button = styled.button`
  width: auto;
  height: 44px;
  padding: 14px 30px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.styles.boxShadowDeep};
  color: 13px;
  line-height: 17px;
  transition: 0.3s;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary2};
    color: ${({ theme }) => theme.colors.white};
  }
`;

export default function WidthWhiteButton() {
  return <Button type="button">Create Report</Button>;
}
