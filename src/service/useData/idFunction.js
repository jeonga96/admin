import * as TOA from "../library/toast";
import * as API from "../api";
import * as APIURL from "../string/apiUrl";

// /**
//  * uid와 cid를 연결하기 위해 연결 여부 확인 후 cid 선택
//  * @param {*} res
//  * @param {*} setClick
//  */
// export function fnSelectCid(res, setClick) {
//   API.servicesPostData(APIURL.urlGetCompany, {
//     cid: res.cid,
//   })
//     .then((res) => {
//       if (!res || !res.data) {
//         console.error("Invalid response:", res);
//         TOA.servicesUseToast("회원 연결이 되지 않은 사업자 회원입니다.", "e");
//         return "";
//       }
//       const UID = res.data.ruid;
//       if (!UID) {
//         TOA.servicesUseToast("회원 연결이 되지 않은 사업자 회원입니다.", "e");
//         return "";
//       } else {
//         setClick(false);
//         console.log(UID);
//         return UID;
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//     });
// }

/**
 * cid에 연결되어있는 uid 확인
 * @param {*} response
 * @param {*} setValueFunction
 * @param {*} setClickFunction
 * @param {*} valueKey
 */
export const selectCompanyManagementNumber = (
  response,
  setValueFunction,
  setClickFunction,
  valueKey
) => {
  // 회사 정보를 얻기 위해 서버에 데이터를 게시
  API.servicesPostData(APIURL.urlGetCompany, {
    cid: response.cid,
  })
    .then((result) => {
      const UID = result.data.ruid;
      if (!UID) {
        // UID가 없으면 토스트 메시지를 보여줍니다
        TOA.servicesUseToast("회원과 연결되지 않은 사업자 회원입니다.", "e");
        setValueFunction(valueKey, "");
      } else {
        // UID를 설정하고 클릭 상태를 관리합니다
        setClickFunction(false);
        setValueFunction(valueKey, UID);
      }
    })
    .catch((error) => console.log(error));
};
