// 서버
import urlPrefixCk from "./apiServer";
export const urlPrefix = urlPrefixCk();

/* 네비게이션  */
export const navUrl = "/data/nav.json";

/* 기타 */
export const urlLogin = urlPrefix + "/pub/login";
export const urlRefreshtoken = urlPrefix + "/svc/refreshToken";
export const urlSettoken = urlPrefix + "/admin/setTokken";

/* 안심번호 */
export const urlCreate050 = urlPrefix + "/admin/addSafeNumber";
export const urlGet050 = urlPrefix + "/admin/getSafeNumber";
export const urlUpdate050 = urlPrefix + "/admin/updateSafeNumber";
export const urlClear050 = urlPrefix + "/admin/clearSafeNumber";

/* 회원관리  */
export const urlAdduser = urlPrefix + "/pub/addUser";
export const urlUserlist = urlPrefix + "/admin/listUser";
export const urlSetUser = urlPrefix + "/admin/setUser";
export const urlGetUser = urlPrefix + "/admin/getUser";
export const urlGetUserDetail = urlPrefix + "/admin/getUserDetail";
export const urlSetUserDetail = urlPrefix + "/admin/setUserDetail";
export const urlSetUserRole = urlPrefix + "/admin/setUserRole";
export const urlSetCsv = urlPrefix + "/admin/uploadCsv";
export const urlGetNick = urlPrefix + "/svc/getUserNick";

/* 회원관리 - 탈퇴요청  */
export const urlSetResignUser = urlPrefix + "/pub/setResignUser";
export const urlListResignUser = urlPrefix + "/pub/listResignUser";

/* 사업자 회원  */
export const urlAddcompany = urlPrefix + "/admin/addCompany";
export const urlCompanylist = urlPrefix + "/admin/listCompany";
export const urlGetCompanyDetail = urlPrefix + "/admin/getCompanyDetailInfo";
export const urlSetCompanyDetail = urlPrefix + "/admin/setCompanyDetailInfo";
export const urlSetCompany = urlPrefix + "/admin/setCompany";
export const urlSetCompanyRemoveRuid = urlPrefix + "/admin/setCompanyRuid";
export const urlGetCompany = urlPrefix + "/admin/getCompany";
export const urlGetUserCid = urlPrefix + "/svc/getUserCid";
export const urlSetCustomerConsult = urlPrefix + "/admin/setCustomerConsult";
export const urlListCustomerConsult = urlPrefix + "/admin/listCustomerConsult";
export const urlGetCustomerConsult = urlPrefix + "/admin/getCustomerConsult";
export const urlSetPayment = urlPrefix + "/admin/setPayment";
export const urlGetPayment = urlPrefix + "/admin/getPayment";
export const urlListPayment = urlPrefix + "/admin/listPayment";

/* 사업자 관리 - 리뷰 */
export const urlReviewList = urlPrefix + "/pub/listCompanyReview";
export const urlGetReview = urlPrefix + "/pub/getCompanyReview";
export const urlSetReview = urlPrefix + "/admin/setCompanyReview";

// 사업자 관리 - 사업자 검색 키워드 추가
export const urlAddCompanyKeyword = urlPrefix + "/admin/addCompanySearch";
export const urlSetCompanyKeyword = urlPrefix + "/admin/setCompanySearch";
export const urlGetCompanyKeyword = urlPrefix + "/admin/getCompanySearch";
export const urlListCompanyKeyword = urlPrefix + "/admin/listCompanySearch";

// 이미지 업로드
export const urlUpImages = urlPrefix + "/svc/upImages";
export const urlGetImages = urlPrefix + "/svc/getImages";

// 이미지 관리 (https://admin.gongsacok.com/setimgs)
export const urlupTagImages = urlPrefix + "/admin/upTagImages";
export const urllistTagImages = urlPrefix + "/admin/listTagImages";
export const urlsetTagImages = urlPrefix + "/admin/setTagImages";
export const urlWazzanggetImages =
  "https://devimgawsback.gongsacok.com/pub/contentsImageTagList";

/* 공지사항 */
export const urlCompanyNoticeList = urlPrefix + "/pub/listCompanyNotice";
export const urlCompanyGetNotice = urlPrefix + "/pub/getCompanyNotice";
export const urlCompanySetNotice = urlPrefix + "/admin/setCompanyNotice";

/* 앱 배너, 콘텐츠 관리 */
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
export const urlListIsSalesKeyword = urlPrefix + "/admin/isSalesKeyword";

// 한옥 키워드
export const urlAddHanokSalesKeyword =
  urlPrefix + "/admin/addHanokSalesKeyword";
export const urlSetHanokSalesKeyword =
  urlPrefix + "/admin/setHanokSalesKeyword";
export const urlListHanokAdminSalesKeyword =
  urlPrefix + "/admin/listHanokSalesKeyword";
export const urlListHanokIsSalesKeyword =
  urlPrefix + "/admin/isHanokSalesKeyword";

// 와짱 이벤트 신청자 관리
export const urlListWzEvent = urlPrefix + "/admin/listWzevent";
export const urlGetWzEvent = urlPrefix + "/admin/getWzevent";
export const urlGetEventApplyInfo = urlPrefix + "/admin/getEventApplyInfo";
export const urlSetEventStatus = urlPrefix + "/admin/setEventStatus";

// 건의사항
export const urlListSuggest = urlPrefix + "/admin/listSuggest";

// 결제수단
export const urlsetPayment = urlPrefix + "/admin/setPayment";
export const urlgetPayment = urlPrefix + "/admin/getPayment";
export const urllistPayment = urlPrefix + "/admin/listPayment";

// 세금계산서
export const urladdTaxBill = urlPrefix + "/admin/addTaxBill";
export const urlsetTaxBill = urlPrefix + "/admin/setTaxBill";
export const urllistTaxBill = urlPrefix + "/admin/listTaxBill";

// 사원 및 지점 관리
export const urlAddDistribution = urlPrefix + "/admin/addDistribution";
export const urlSetDistribution = urlPrefix + "/admin/setDistribution";
export const urlGetDistribution = urlPrefix + "/admin/getDistribution";
export const urlListDistribution = urlPrefix + "/admin/listDistribution";

// 점검 예고관리
export const urlAddInspectionTime = urlPrefix + "/admin/addInspectionTime";
export const urlSetInspectionTime = urlPrefix + "/admin/setInspectionTime";
export const urlGetInspectionTime = urlPrefix + "/pub/getInspectionTime";

// 시도군구 검색
export const urlGetDepartInfo = urlPrefix + "/pub/getDepartInfo";

// 녹취록 등록
export const urlListRecord = urlPrefix + "/admin/listTelRecord";
export const urlAddRecord = urlPrefix + "/admin/addTelRecord";
export const urlSetRecord = urlPrefix + "/admin/setTelRecord";
export const urlGetRecord = urlPrefix + "/admin/getTelRecord";

// 최신글 관리
export const urListlLocalContent = urlPrefix + "/admin/listLocalContent";
export const urSetlLocalConten = urlPrefix + "/admin/setLocalContent";
export const urGetlLocalConten = urlPrefix + "/admin/getLocalContent";
