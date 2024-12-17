/**
 * redux reducer (data, click) 초기화
 * @param {*} dispatch
 */
export const serviesCleanup = (dispatch) => {
  console.log("▶️ serviesCleanup - data, click");
  dispatch({
    type: "serviceGetedData",
    payload: {},
  });

  dispatch({
    type: "serviceWriteData",
    payload: {},
  });

  dispatch({
    type: "serviceImgData",
    payload: "",
  });

  dispatch({
    type: "serviceimgsData",
    payload: "",
  });

  dispatch({
    type: "servicemulTiImgsData",
    payload: "",
  });

  dispatch({
    type: "serviceMultilAddressData",
    payload: "",
  });

  dispatch({
    type: "serviceClick",
    payload: false,
  });

  dispatch({
    type: "serviceModalClick",
    payload: false,
  });
};

/**
 * redux reducer (page) 초기화
 * @param {*} dispatch
 */
export const serviesPaginationCleanup = (dispatch) => {
  console.log("▶️ serviesCleanup - page");
  dispatch({
    type: "servicePageData",
    payload: { getPage: 0, activePage: 1 },
  });

  dispatch({
    type: "serviceListPageData",
    payload: {},
  });

  dispatch({
    type: "serviceListFilterData",
    payload: {},
  });
};
