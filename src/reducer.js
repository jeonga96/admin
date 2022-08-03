import {
  axiosPostData,
  setStorage,
  axiosPostToken,
  getStorage,
} from "./Services/importData";
import * as string from "./Services/string";

const initialState = {
  login: { userid: "", passwd: "" },
  userInfoAdd: { userid: "", passwd: "", passwdCk: "" },
  companyAdd: { name: "" },
  listUser: [],
  listUserPage: {},
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

    case "addUserEvent":
      axiosPostData(string.urlAdduser, {
        userid: newState.userInfoAdd.userid[0],
        passwd: newState.userInfoAdd.passwd[0],
      })
        .then((res) => {
          console.log("axios는 성공했는데 말이죠", res);
          if (
            res.status === "fail" &&
            res.emsg === "Database update failure. check duplicate userid"
          ) {
            alert("이미 가입된 아이디입니다. 다른 아이디를 입력해 주세요,");
            return;
          }
          if (res.status === "fail") {
            alert("잘못된 값을 입력했습니다.");
            return;
          }
          if (res.status === "success") {
            alert("가입이 완료되었습니다!");
            window.location.href = `${process.env.PUBLIC_URL}/user`;
            return;
          }
        })
        .catch((error) => console.log("실패", error.response));
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

    case "userInfoAddInputChange":
      newState.userInfoAdd = action.payload;
      break;

    case "companyInfoAddInputChange":
      newState.companyAdd = action.payload;
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
