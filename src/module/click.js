const initialState = {
  click: false, // click이벤트 저장
  modalClick: false, // click이벤트 저장
};

export default function click(state = initialState, action) {
  const newState = { ...state };

  switch (action.type) {
    case "serviceClick":
      newState.click = action.payload;
      break;

    case "serviceModalClick":
      newState.modalClick = action.payload;
      break;

    default:
      return newState;
  }
  return newState;
}
