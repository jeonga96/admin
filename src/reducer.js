import {
  axiosPostData,
  setStorage,
  axiosPostToken,
  getStorage,
} from "./Services/importData";
import * as string from "./Services/string";

const initialState = {
  login: { userid: "", passwd: "" },
  navState: true,
};

const reducer = (state = initialState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case "loginEvent":
      axiosPostData(string.urlLogin, {
        userid: newState.login.userid[0],
        passwd: newState.login.passwd[0],
      })
        .then((res) => {
          if (res.status === "fail") {
            alert("회원이 아닙니다. 회원가입을 먼저 진행해 주세요.");
            return;
          }
          if (res.status === "success") {
            console.log("완료됐나용");
            const accessToken = res.data.jtoken;
            setStorage(string.ISLOGIN, `${accessToken}`);
            console.log(res.data);
            window.location.href = `${process.env.PUBLIC_URL}/`;
            return;
          }
        })
        .catch((error) => console.log(error.response));
      break;

    case "listUserEvent":
      const accessToken = getStorage(string.ISLOGIN);
      axiosPostToken(
        string.urlUserlist,
        {
          offset: 0,
          size: 10,
        },
        accessToken
      )
        .then((res) => {
          console.log("aixos후 값은?", res);
          if (res.status === "success") {
            newState.listUserPage = res.page;
            newState.listUser = res.data;
          }
        })
        .catch((err) => console.log(err));
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
