import { loginEvent } from "./service/importData";

const initialState = {
  userInfo: { userid: "", passwd: "" },
};

// 리듀서를 생성한다. state와 action을 가지는 함수를 parameter로 받는다.
const reducer = (state = initialState, action) => {
  const newState = { ...state };
  // 액션에 따라서, 새로운 상태 변수에 변경을 가한다.
  switch (action.type) {
    case "loginEvent":
      // newState.testValue++;
      loginEvent();
      break;
    case "addSome":
      newState.testValue = action.payload;
      break;
    default:
      break;
  }
  return newState;
};

export default reducer;
