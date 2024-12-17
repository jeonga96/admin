import CHECKBRANCH from "../../checkbranch";

export default function urlPrefixCk() {
  if (CHECKBRANCH() === "DEVELOP") {
    return "";
  } else if (CHECKBRANCH() === "STAGE") {
    return "";
  } else if (CHECKBRANCH() === "RELEASE") {
    return "";
  }
}
