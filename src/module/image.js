const initialState = {
  imgData: null, // 타이틀 이미지
  imgsData: "", // 상세 이미지
  multiImgsData: [], // 사업자 등록증과 같은 기타 다용도 이미지
};

export default function image(state = initialState, action) {
  const newState = { ...state };

  switch (action.type) {
    case "serviceImgData":
      newState.imgData = action.payload;
      break;

    case "serviceimgsData":
      newState.imgsData = action.payload;
      break;

    case "servicemulTiImgsData":
      newState.multiImgsData = action.payload;
      break;

    default:
      return newState;
  }
  return newState;
}
