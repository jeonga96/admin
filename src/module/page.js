// import { SET_CURRENT_PAGE } from "../service/actions";

const initialState = {
  pageData: { getPage: 0, activePage: 1 },
  listPageData: {},
  listFilterData: {},
};

export default function page(state = initialState, action) {
  const newState = { ...state };

  switch (action.type) {
    case "servicePageData":
      newState.pageData = action.payload;
      break;

    case "serviceListPageData":
      newState.listPageData = action.payload;
      break;

    case "serviceListFilterData":
      newState.listFilterData = action.payload;
      break;

    default:
      return newState;
  }
  return newState;
}
