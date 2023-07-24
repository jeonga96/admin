const initialState = {
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
