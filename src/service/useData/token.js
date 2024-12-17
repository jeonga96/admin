import * as TOA from "../library/toast";
import * as API from "../api";
import * as APIURL from "../string/apiUrl";

/**
 * cid가 최근에 할당받은 토큰 삭제하는 기능
 * @param {*} cid
 */
export const serviesSetToken = (cid) => {
  API.servicesPostData(APIURL.urlSettoken, { cid: cid }).then((res) => {
    if (res?.status === "success") {
      TOA.servicesUseToast("완료되었습니다.", "s");
    }
  });
};
