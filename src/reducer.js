import { axiosSetData, setStorage } from "./service/importData";
import { ISLOGIN, loginUrl } from "./service/string";

const initialState = {
  userInfo: { userid: "", passwd: "" },
  navState: true,
};

// 리듀서를 생성한다. state와 action을 가지는 함수를 parameter로 받는다.
const reducer = (state = initialState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case "loginEvent":
      axiosSetData(loginUrl, {
        userid: newState.userInfo.userid[0],
        passwd: newState.userInfo.passwd[0],
      })
        .then((res) => {
          if (res.status === "fail") {
            alert("회원이 아닙니다. 회원가입을 먼저 진행해 주세요.");
            return;
          }
          if (res.status === "success") {
            const accessToken = res.data.jtoken;
            setStorage(ISLOGIN, `${accessToken}`);
            window.location.href = `${process.env.PUBLIC_URL}/`;
            return;
          }
        })
        .catch((error) => console.log(error.response));
      break;
    case "userInfoInputChange":
      newState.navState = action.payload;
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
