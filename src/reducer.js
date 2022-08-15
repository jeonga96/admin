import { servicesPostData, servicesSetStorage } from "./Services/importData";
// import * as string from "./Services/string";
import { urlLogin, ISLOGIN } from "./Services/string";

const initialState = {
  login: { userid: "", passwd: "" },
  navState: true,
};

const reducer = (state = initialState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case "loginEvent":
      servicesPostData(urlLogin, {
        userid: newState.login.userid[0],
        passwd: newState.login.passwd[0],
      })
        .then((res) => {
          if (res.status === "fail") {
            alert("회원이 아닙니다. 회원가입을 먼저 진행해 주세요.");
            return;
          }
          if (res.status === "success") {
            const accessToken = res.data.jtoken;
            console.log("로그인이 완료되었습니다!", accessToken);
            servicesSetStorage(ISLOGIN, accessToken);
            return (window.location.href = "/");
          }
        })
        .catch((error) => console.log("login error", error.response));
      break;

    case "userInfoInputChange":
      newState.login = action.payload;
      break;

    case "navEvent":
      newState.navState = action.payload;
      break;

    default:
      break;
  }
  return newState;
};

export default reducer;
