import CHECKBRANCH from "../checkbranch";

/* string 선언 - reducer */
export const TOKEN = "token";
export const UID = "uid";
export const ALLKEYWORD = "allKeyword";
export const WRITER = "writer";

/* 외부 키 */
// export const KAKAO_KEY = "c45951e21874a8fc30289cd99e476323"; // 계정:gongsacok
// 앱키 수정은 index.html

/* GNB */
export const navUrl = "/data/nav.json";

/* 공사콕 url & 외부 API url */
function urlPrefixCk() {
  if (CHECKBRANCH() === "DEVELOP") {
    return "https://devawsback.gongsacok.com";
  } else if (CHECKBRANCH() === "STAGE") {
    return "https://stageawsback.gongsacok.com";
  } else if (CHECKBRANCH() === "RELEASE") {
    return "https://releaseawsback.gongsacok.com";
  }
}
export const urlPrefix = urlPrefixCk();

/* 기타 */
export const urlLogin = urlPrefix + "/pub/login";
export const urlRefreshtoken = urlPrefix + "/svc/refreshToken";

/* 안심번호 */
export const urlCreate050 = urlPrefix + "/admin/addSafeNumber";
export const urlGet050 = urlPrefix + "/admin/getSafeNumber";
export const urlUpdate050 = urlPrefix + "/admin/updateSafeNumber";
export const urlClear050 = urlPrefix + "/admin/clearSafeNumber";

/* user관련 */
export const urlAdduser = urlPrefix + "/pub/addUser";
export const urlUserlist = urlPrefix + "/admin/listUser";
export const urlSetUser = urlPrefix + "/admin/setUser";
export const urlGetUser = urlPrefix + "/admin/getUser";
export const urlGetUserDetail = urlPrefix + "/admin/getUserDetail";
export const urlSetUserDetail = urlPrefix + "/admin/setUserDetail";
export const urlSetUserRole = urlPrefix + "/admin/setUserRole";
export const urlSetCsv = urlPrefix + "/admin/uploadCsv";

/* company 관련 */
export const urlAddcompany = urlPrefix + "/admin/addCompany";
export const urlCompanylist = urlPrefix + "/admin/listCompany";
export const urlGetCompanyDetail = urlPrefix + "/admin/getCompanyDetailInfo";
export const urlSetCompanyDetail = urlPrefix + "/admin/setCompanyDetailInfo";
export const urlSetCompany = urlPrefix + "/admin/setCompany";
export const urlGetCompany = urlPrefix + "/admin/getCompany";
export const urlGetUserCid = urlPrefix + "/svc/getUserCid";
export const urlSetCustomerConsult = urlPrefix + "/admin/setCustomerConsult";
export const urlListCustomerConsult = urlPrefix + "/admin/listCustomerConsult";
export const urlGetCustomerConsult = urlPrefix + "/admin/getCustomerConsult";

/* 이미지 관련 */
export const urlUpImages = urlPrefix + "/svc/upImages";
export const urlGetImages = urlPrefix + "/svc/getImages";

/* 공지사항 */
export const urlCompanyNoticeList = urlPrefix + "/pub/listCompanyNotice";
export const urlCompanyGetNotice = urlPrefix + "/pub/getCompanyNotice";
export const urlCompanySetNotice = urlPrefix + "/admin/setCompanyNotice";

/* 리뷰 */
export const urlReviewList = urlPrefix + "/pub/listCompanyReview";
export const urlGetReview = urlPrefix + "/pub/getCompanyReview";
export const urlSetReview = urlPrefix + "/admin/setCompanyReview";

/* 앱관리 */
export const urlContentList = urlPrefix + "/pub/listContent";
export const urlGetContent = urlPrefix + "/pub/getContent";
export const urlSetContent = urlPrefix + "/admin/setContent";

// 키워드
export const urlAllKeyword = urlPrefix + "/admin/allKeyword";
export const urlSetKeyword = urlPrefix + "/admin/setKeyword";
export const urlLikeKeyword = urlPrefix + "/pub/likeKeyword";

// 견적 요청서
export const urlGetEstimateInfo = urlPrefix + "/admin/getEstimateInfo";
export const urlSetEstimateInfo = urlPrefix + "/admin/setEstimateInfo";
export const urlListEstimateInfo = urlPrefix + "/admin/listEstimateInfo";

// 견적서
export const urlGetProposalInfo = urlPrefix + "/admin/getProposalInfo";
export const urlSetProposalInfo = urlPrefix + "/admin/setProposalInfo";
export const urlListProposalInfo = urlPrefix + "/admin/listProposalInfo";

// 키워드
export const urlAddSalesKeyword = urlPrefix + "/admin/addSalesKeyword";
export const urlSetSalesKeyword = urlPrefix + "/admin/setSalesKeyword";
export const urlListAdminSalesKeyword = urlPrefix + "/admin/listSalesKeyword";
export const urlListPubSalesKeyword = urlPrefix + "/pub/listSalesKeyword";
export const urlListIsSalesKeyword = urlPrefix + "/admin/isSalesKeyword";

// 와짱 이벤트 관리
export const urlListWzEvent = urlPrefix + "/admin/listWzevent";
export const urlGetWzEvent = urlPrefix + "/admin/getWzevent";
