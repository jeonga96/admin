/* GNB */
export const navUrl = "/data/nav.json";

/* 공사콕 url & API */
export const urlPrefix = "http://devback.gongsacok.com:8080";

export const urlLogin = urlPrefix + "/pub/login";
export const urlRefreshtoken = urlPrefix + "/svc/refreshToken";
// export const urlRelateCheck = urlPrefix + "/svc/getRelateId";

/* user관련 */
export const urlAdduser = urlPrefix + "/pub/addUser";
export const urlUserlist = urlPrefix + "/admin/listUser";
export const urlSetUser = urlPrefix + "/admin/setUser";
export const urlGetUserDetail = urlPrefix + "/admin/getUserDetail";
export const urlSetUserDetail = urlPrefix + "/admin/setUserDetail";
export const urlSetUserRole = urlPrefix + "/admin/setUserRole";

/* company 관련 */
export const urlAddcompany = urlPrefix + "/admin/addCompany";
export const urlCompanylist = urlPrefix + "/admin/listCompany";
export const urlGetCompanyDetail = urlPrefix + "/admin/getCompanyDetailInfo";
export const urlSetCompanyDetail = urlPrefix + "/admin/setCompanyDetailInfo";
export const urlSetCompany = urlPrefix + "/admin/setCompany";
export const urlGetCompany = urlPrefix + "/admin/getCompany";

/* 이미지 관련 */
export const urlUpImages = urlPrefix + "/svc/upImages";
export const urlGetImages = urlPrefix + "/svc/getImages";

/* 공지사항 */
export const urlNoticeList = urlPrefix + "/pub/listCompanyNotice";
export const urlGetNotice = urlPrefix + "/pub/getCompanyNotice";
export const urlSetNotice = urlPrefix + "/svc/setCompanyNotice";

/* 리쥬 */
export const urlReviewList = urlPrefix + "/pub/listCompanyReview";
export const urlGetReview = urlPrefix + "/pub/getCompanyReview";

/* string 선언 - reducer */
export const TOKEN = "token";
export const RETOKEN = "re_token";
export const UID = "uid";

/* 외부 키 */
export const KAKAO_KEY = "0dc0b365e2e0ca17c6c8032ea93a8337";
