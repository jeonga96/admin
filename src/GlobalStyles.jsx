import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
${reset}
* { 
  font-family: -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
}
div, img, span, p, ul {box-sizing: border-box;}
button {
  border:none;
  background-color: transparent;
  cursor: pointer;
}
h2{
  ${({ theme }) => theme.styles.blind}
}

#wrap{
  width: 100%;
  height: auto;
  ${({ theme }) => theme.media.wideTab}{
    display: grid;
    grid-template-columns: 20vw 1fr;
    &::before, &:before{
      content: "";
      height: 50px;
      transition: all 500ms ease-in;
    }
  }
  // pc version
  ${({ theme }) => theme.media.widePc}{
    display: grid;
    grid-template-columns: 270px 1fr;
    &::before, &:before{
      content: "";
      height: 50px;
      transition: all 500ms ease-in;
    }
  }// pc version
}//#wrap

#WrapBox {
    transition: all 500ms ease-in;
    // PC version
    ${({ theme }) => theme.media.pc}{
      #nav_open_btn{
        display: none;
      }
    }// PC version
  }
`;

export default GlobalStyle;
