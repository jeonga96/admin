import { servicesPostData, servicesSetStorage } from "./Services/importData";
import { urlLogin, TOKEN, UID } from "./Services/string";

const initialState = {
  login: { userid: "", passwd: "" },
  imgData: "",
  imgsData: "",
  multiImgsData: "",
  navState: true,
  getedData: {},
};

const reducer = (state = initialState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case "loginEvent":
      servicesPostData(urlLogin, {
        userid: newState.login.userid,
        passwd: newState.login.passwd,
      })
        .then((res) => {
          if (res.status === "fail") {
            alert("회원이 아닙니다. 회원가입을 먼저 진행해 주세요.");
            return;
          }
          if (res.status === "success") {
            const accessToken = res.data.jtoken;
            const uid = res.data.uid;

            servicesSetStorage(TOKEN, accessToken);
            servicesSetStorage(UID, uid);
            window.location.href = "/";
            return;
          }
        })
        .catch((error) => console.log("reducer login error", error));
      break;

    case "getedData":
      newState.getedData = action.payload;
      break;

    case "imgData":
      newState.imgData = action.payload;
      break;

    case "imgsData":
      newState.imgsData = action.payload;
      break;

    case "multiImgsData":
      newState.multiImgsData = action.payload;
      break;

    case "userInfoInputChange":
      newState.login = action.payload;
      break;

    case "navEvent":
      newState.navState = action.payload;
      break;

    default:
      return newState;
  }
  return newState;
};
export default reducer;
