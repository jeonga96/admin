import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyles = createGlobalStyle`

${reset}
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
* { 
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
}
div, img, span, p, ul{box-sizing: border-box;}

#main {
    width: auto;
    background-color: #eee;
    transition: all 500ms ease-in;
  }
  // PC 버전
@media screen and (min-width:992px) {
  #main {
    transition: all 500ms ease-in;
    margin-left: 270px;
    .menu_open{
      display: none;
    }
  }
}
`;

export default GlobalStyles;
