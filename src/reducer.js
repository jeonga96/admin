import { axiosPostData, setStorage, getStorage } from "./service/importData";
import { ISLOGIN, loginUrl, addUserUrl } from "./service/string";

const initialState = {
  userInfo: { userid: "", passwd: "" },
  userInfoAdd: { userid: "", passwd: "", passwdCk: "" },
  navState: true,
  popupState: false,
};

const reducer = (state = initialState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case "loginEvent":
      axiosPostData(loginUrl, {
        userid: newState.userInfo.userid[0],
        passwd: newState.userInfo.passwd[0],
      })
        .then((res) => {
          if (res.status === "fail") {
            alert("회원이 아닙니다. 회원가입을 먼저 진행해 주세요.");
            return;
          }
          if (res.status === "success") {
            console.log("완료됐나용");
            const accessToken = res.data.jtoken;
            setStorage(ISLOGIN, `${accessToken}`);
            window.location.href = `${process.env.PUBLIC_URL}/`;
            return;
          }
        })
        .catch((error) => console.log(error.response));
      break;

    case "addUserEvent":
      // Authorization: getStorage(ISLOGIN)
      axiosPostData(addUserUrl, {
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
            window.location.reload();
            return;
          }
        })
        .catch((error) => console.log("실패", error.response));
      break;

    case "userInfoInputChange":
      newState.userInfo = action.payload;
      break;

    case "userInfoAddInputChange":
      newState.userInfoAdd = action.payload;
      break;

    case "navEvent":
      newState.navState = action.payload;
      break;

    case "popupEvent":
      newState.popupState = action.payload;
      break;

    default:
      break;
  }
  return newState;
};

export default reducer;
