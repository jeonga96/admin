// e.g -> ${({ theme }) => theme.media.mob} {}
// function e.g -> ${({ theme }) => theme.vwMob(100)};

// size
const size = {
  tab: 768,
  pc: 992,
  pullPc: 1200,
};

// vw unit
const vwTab = (objSize) => `${(objSize / size.tab) * 100}vw;`;
const vwLap = (objSize) => `${(objSize / size.pc) * 100}vw;`;

// responsive
const media = {
  mob: `@media screen and (max-width: ${size.tab - 1}px)`,
  tab: `@media screen and (min-width:${size.tab}px) and (max-width: ${
    size.pc - 1
  }px)`,
  wideTab: `@media screen and (min-width:${size.pc}px) and (max-width: ${
    size.pullPc - 1
  }px)`,
  pc: `@media screen and (min-width: ${size.pc}px)`,
  minPc: `@media screen and (max-width: ${size.pc - 1}px)`,
  widePc: `@media screen and (min-width: ${size.pullPc}px)`,
  maxTab: `@media screen and (min-width: ${size.tab}px)`,
  minTab: `@media screen and (max-width: ${size.tab - 1}px)`,
};

// style 적용 시 반복적으로 사용하는 코드
const styles = {
  center: "margin:0 auto;",
  centerPositon:
    "position: absolute; transform: translateX(-50%); margin-left: 50%;",
  blind:
    "border: 0; clip: rect(0 0 0 0); clip-path: inset(50%); width: 1px; height: 1px; margin: -1px; overflow: hidden; padding: 0; position: absolute; white-space: nowrap;",
  displayNone:
    "display: block; width: 0; height: 0; position: absolute; z-index:-1; overflow: hidden;",
  full: "display:block; width:100%; height:100%;",
  fontBasic:
    "font-size: 16px; font-weight: 500; line-height: 160%; word-break: keep-all;",
  boxShadow: "0 12px 30px rgb(80 143 244 / 10%);",
  boxShadowDeep: "0 3px 11px rgb(0 0 0 / 17%)",
};

// font
const font = {
  point: "'Comfortaa', cursive;",
};

// 색상 변수
const colors = {
  black: "#101038",
  white: "#fff",
  gray: "#f1f5fa",
  pointGray: "#a5adc6",
  bgGray: "#F3F4F3",
  primary: "#64C5B1",
  primary2: "#0d6efd",
};

export const theme = {
  vwTab,
  vwLap,
  colors,
  size,
  media,
  styles,
  font,
};

export default theme;
