import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyles = createGlobalStyle`

${reset}
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
* { 
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
}
div, img, span, p, ul{box-sizing: border-box;}
button{
  border:none;
  background-color: transparent;
  cursor: pointer;
}

#wrap{
  
  ${({ theme }) => theme.media.pc}{
     &::before, &:before{
      display: inline-block;
      content: "";
      width: ${({ theme }) => theme.vwLap(220)};
      max-width: 290px;
      height: 100vw;
      transition: all 500ms ease-in;
      background-color: #ff0;
    }
}
#main {
    width: 100vw;
    background-color: #eee;
    transition: all 500ms ease-in;
  }
// tablet version
${({ theme }) => theme.media.tab}{

}

// PC version
${({ theme }) => theme.media.pc}{
  display: inline-block;
  #main {
    /* transition: all 500ms ease-in; */
    /* &::before, &:before{
      content: "";
      display: inline-block;
      width: ${({ theme }) => theme.vwLap(220)};
      max-width: 280px;
      height: 100vw;
      transition: all 500ms ease-in;
      background-color: #ff0;
    } */
    #nav_open_btn{
      display: none;
    }
  }
}

`;

export default GlobalStyles;
