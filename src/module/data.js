const initialState = {
  getedData: {}, // api 등 가져온 데이터 저장
  getedSummaryData: {}, // api 등 가져온 데이터 저장
  writeData: {}, // api 등 가져온 데이터 저장
  multilAddressData: "", // 주소저장
};

export default function data(state = initialState, action) {
  const newState = { ...state };

  switch (action.type) {
    case "serviceGetedData":
      newState.getedData = action.payload;
      break;

    case "serviceGetedSummaryData":
      newState.getedSummaryData = action.payload;
      break;

    case "serviceWriteData":
      newState.writeData = action.payload;
      break;

    case "serviceMultilAddressData":
      newState.multilAddressData = action.payload;
      break;

    default:
      return newState;
  }
  return newState;
}
