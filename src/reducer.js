const initialState = {
  getedData: {}, // api 등 가져온 데이터 저장
  writeData: {}, // api 등 가져온 데이터 저장
  imgData: "", // 타이틀 이미지
  imgsData: "", // 상세 이미지
  multiImgsData: "", // 사업자 등록증과 같은 기타 다용도 이미지
  multilAddressData: "", // 주소저장
  navState: true, // 반응형 nav
  click: false, // click이벤트 저장
  modalClick: false, // click이벤트 저장
};

const reducer = (state = initialState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case "serviceGetedData":
      newState.getedData = action.payload;
      break;

    case "serviceWriteData":
      newState.writeData = action.payload;
      break;

    case "serviceImgData":
      newState.imgData = action.payload;
      break;

    case "serviceimgsData":
      newState.imgsData = action.payload;
      break;

    case "servicemulTiImgsDataEvent":
      newState.multiImgsData = action.payload;
      break;

    case "serviceMultilAddressData":
      newState.multilAddressData = action.payload;
      break;

    case "serviceNav":
      newState.navState = action.payload;
      break;

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
};
export default reducer;
