import CHECKBRANCH from "../../checkbranch";

export default function urlPrefixCk() {
  if (CHECKBRANCH() === "DEVELOP") {
    return "https://devawsback.gongsacok.com";
  } else if (CHECKBRANCH() === "STAGE") {
    return "https://stageawsback.gongsacok.com";
  } else if (CHECKBRANCH() === "RELEASE") {
    return "https://releaseawsback.gongsacok.com";
  }
}
