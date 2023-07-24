import { servicesPostData } from "./service/api";
import * as ST from "./service/storage";
import { urlLogin, TOKEN, UID } from "./service/string";

const initialState = {
  login: { userid: "", passwd: "" },
  imgData: "",
  imgsData: "",
  multiImgsData: "",
  multilAddressData: "",
  navState: true,
  click: false,
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

            ST.servicesSetStorage(TOKEN, accessToken);
            ST.servicesSetStorage(UID, uid);
            console.log(res);
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

    case "multilAddressData":
      newState.multilAddressData = action.payload;
      break;

    case "userInfoInputChange":
      newState.login = action.payload;
      break;

    case "navEvent":
      newState.navState = action.payload;
      break;

    case "clickEvent":
      newState.click = action.payload;
      break;

    default:
      return newState;
  }
  return newState;
};
export default reducer;
