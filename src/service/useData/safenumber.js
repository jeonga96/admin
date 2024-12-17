import * as TOA from "../library/toast";
import * as API from "../api";
import * as APIURL from "../string/apiUrl";
import * as STR from "../string/stringtoconst";
import * as FM from "./format";

/**
 * startNumber부터 count(현재 할당받은 10000개의 안심번호)까지 배열 생성
 * @param {function} setList - 상태 설정 함수
 * @param {function} setLoading - 로딩 상태 설정 함수
 * @returns {Promise<Array>} - 사용되지 않은 안심번호 배열
 */
export async function serviesSafeNumSearch(setList, setLoading) {
  let useSearchSafeNum = [];

  // 로딩 상태 설정
  if (setLoading) {
    setLoading(true);
  }

  try {
    // API 호출
    const res = await API.servicesPostData(APIURL.urlCompanylist, {
      offset: 0,
      size: STR.FIRST_SAFENUM_1000 + STR.SECOND_SAFENUM_10000 * 2,
      telnum: "0507",
    });

    // API 응답 처리
    if (res.status === "fail") {
      TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
    } else if (res.status === "success") {
      useSearchSafeNum.push(...res.data);
      const SafeNumber = serviesGnerateNumbers();

      // 사용되지 않은 안심번호 필터링
      const filterNumber = SafeNumber.filter(
        (number) =>
          !useSearchSafeNum.some((obj) => obj.extnum === number.toString())
      );

      console.log("filterNumber:", filterNumber);

      // 할당된 안심번호가 모두 사용되었는지 확인
      if (
        filterNumber.length >=
        STR.FIRST_SAFENUM_1000 + STR.SECOND_SAFENUM_10000 * 2
      ) {
        alert("할당된 안심번호를 모두 사용하였습니다.");
      } else {
        // 상태 설정 함수 호출 또는 필터링된 번호 배열 반환
        if (typeof setList === "function") {
          setList([...filterNumber]);
        } else {
          return filterNumber;
        }
      }
    }
  } catch (error) {
    console.error("Error during API call:", error);
    return [];
  } finally {
    // 로딩 상태 해제
    if (setLoading) {
      setLoading(false);
    }
  }
}

/**
 * 숫자 데이터를 4자리마다 나눈 후 사이에 "-" 넣기
 * @param {number|string} number - 숫자 또는 숫자 문자열
 * @returns {string} 4자리마다 "-"가 삽입된 문자열
 */
export function serviesNumberSlice4(number) {
  const str = number.toString(); // 숫자를 문자열로 변환
  let result = "";

  // 4자리마다 "-" 추가
  for (let i = 0; i < str.length; i += 4) {
    result += str.slice(i, i + 4) + "-";
  }

  // 마지막에 추가된 "-" 제거
  return result.slice(0, -1);
}

/**
 * 사용할 수 있는 안심번호 총 목록 만들기
 * @returns {string[]} 생성된 안심번호 목록
 */
export function serviesGnerateNumbers() {
  const numbers = [];

  // 번호 생성 함수
  const generateNumbers = (startNumber, count) => {
    const baseNumber = startNumber.slice(0, -4);
    const initialNumber = Number(startNumber.slice(-4));
    for (let i = 0; i < count; i++) {
      const formattedNumber = String(initialNumber + i)
        .padStart(4, "0")
        .slice(-4);
      const newSlice4 = FM.serviesNumberSlice4AndRmove4(
        baseNumber + formattedNumber
      );
      numbers.push(`${newSlice4}-${formattedNumber}`);
    }
  };

  // 가장 처음 할당 받은 안심번호 1,000개
  generateNumbers("050701769000", STR.FIRST_SAFENUM_1000);

  // 추가 번호 요청하여 받은 안심번호 10,000개 - 첫 번째 세트
  generateNumbers("050701810000", STR.SECOND_SAFENUM_10000);

  // 추가 번호 요청하여 받은 안심번호 10,000개 - 두 번째 세트
  generateNumbers("050701750000", STR.SECOND_SAFENUM_10000);

  return numbers;
}

/**
 * 안심번호 서버와 공사콕 서버 간의 불일치 문제를 해결하는 함수
 * 공사콕 사업자 목록에는 있으나, 안심번호 서버에는 저장되지 않은 경우
 * @param {*} VNO - 가상번호
 */
export async function serviesUsedSafeNumSetAdmin(VNO) {
  console.log("사용 중인 가상번호입니다.");
  try {
    // 1. 안심번호 서버에서 가상번호 정보를 가져옵니다.
    const RES_Get050 = await API.servicesPostData(APIURL.urlGet050, {
      vno: VNO,
    });

    if (RES_Get050.status === "success") {
      // 2. 안심번호가 저장된 경우, 공사콕 서버에서 관련 회사 정보를 조회합니다.
      console.log("1", FM.serviesFormatPhoneNumber(RES_Get050.data.rcvNo1));

      const RES_CompanyList = await API.servicesPostData(
        APIURL.urlCompanylist,
        {
          offset: 0,
          size: 5,
          telnum: FM.serviesFormatPhoneNumber(RES_Get050.data.rcvNo1),
          vnoName: RES_Get050.data.vnoName,
        }
      );

      if (RES_CompanyList.status === "success") {
        console.log("2", RES_Get050);
        console.log("3", RES_Get050.data.rcvNo1, RES_CompanyList);

        // 3. 공사콕 서버에서 가져온 데이터가 배열인지 객체인지 확인합니다.
        const companies = Array.isArray(RES_CompanyList.data)
          ? RES_CompanyList.data
          : [RES_CompanyList.data];

        // 4. 각 회사 정보에 대해 처리합니다.
        for (const company of companies) {
          console.log(company, company.extnum);

          if (company?.extnum) {
            // 4.1 저장된 안심번호 값이 있을 때
            if (company.extnum !== serviesNumberSlice4(VNO)) {
              // 저장된 번호가 검색하려는 번호와 다르면 안심번호 서버에서 삭제
              await API.servicesPostData(APIURL.urlClear050, { vno: VNO });
              await API.servicesPostData(APIURL.urlSetCompanyDetail, {
                cid: company.cid,
                extnum: "",
              });
            }
          } else {
            // 4.2 저장된 안심번호 값이 없을 때
            await API.servicesPostData(APIURL.urlClear050, { vno: VNO });
            await API.servicesPostData(APIURL.urlSetCompanyDetail, {
              cid: company.cid,
              extnum: "",
            });
          }
        }
      }

      if (RES_CompanyList.status === "fail") {
        // 안심번호가 공사콕 서버에서 조회되지 않는 경우
        await API.servicesPostData(APIURL.urlClear050, { vno: VNO });
        TOA.servicesUseToast("오류가 발생됐습니다. 다시 저장해주세요.", "e");
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// /** serviesSafeNumBigDataSetting
//  * 안심번호 대용량 업로드에서 사용되는 안심번호 등록
//  * @param {*} cid - 회사 ID
//  * @param {object} data - 안심번호 데이터
//  * @param {function} setLoading - 로딩 상태 업데이트 함수
//  * @param {function} setErrorWrap - 오류 상태 업데이트 함수
//  * @param {function} setSuccessWrap - 성공 상태 업데이트 함수
//  */
// export async function serviesSafeNumBigDataSetting(
//   cid,
//   data,
//   setLoading,
//   setErrorWrap,
//   setSuccessWrap
// ) {
//   if (APIURL.urlPrefix === "https://releaseawsback.gongsacok.com") {
//     const MOBILE_NUM = data.mobilenum ? data.mobilenum : "";
//     const TEL_NUM = data.telnum ? data.telnum : "";
//     let message;

//     const list = await serviesSafeNumSearch([]);

//     async function safeNumSubmit(index, attempt = 0) {
//       // 사용 가능한 안심번호가 있을 때
//       if (list.length > 0) {
//         return new Promise(async (resolve, reject) => {
//           if (attempt < 2) {
//             const VNO = list[index].replaceAll("-", "").toString();

//             const RCVNO1 =
//               MOBILE_NUM !== ""
//                 ? MOBILE_NUM.replaceAll("-", "").toString()
//                 : "";
//             const RCVNO2 =
//               TEL_NUM !== "" ? TEL_NUM.replaceAll("-", "").toString() : "";

//             try {
//               const res = await API.servicesPostData(APIURL.urlCreate050, {
//                 channelId: "wazzang",
//                 vno: VNO,
//                 vnoName: data.name,
//                 status: "Y",
//                 rcvNo1: RCVNO1 !== "" ? RCVNO1 : RCVNO2,
//                 rcvNo2: "",
//                 bizStartTime: "0000",
//                 bizEndTime: "2359",
//                 colorringIdx: 119158,
//                 rcvMentIdx: 119159,
//                 bizEndMentIdx: 119160,
//                 holiMentIdx: 119161,
//                 holiWeek: "11111",
//                 holiDay: "1111111",
//                 holidaySet: "N",
//                 recType: "0",
//               });

//               message = res.emsg;

//               if (res && res.status === "success") {
//                 const companyDetailRes = await API.servicesPostData(
//                   APIURL.urlSetCompanyDetail,
//                   { rcid: cid, extnum: list[index] }
//                 );

//                 if (companyDetailRes && companyDetailRes.status === "success") {
//                   // console.log(`${cid} : gooood`, index, VNO, res);
//                   setLoading((res) => [...res, cid]);
//                   setSuccessWrap((res) => [
//                     ...res,
//                     { cid: cid, message: `${list[index]}가 추가되었습니다.` },
//                   ]);
//                   resolve(); // 성공 시 resolve 호출
//                   // reject(); // 실패 시 reject 호출
//                 }
//               } else {
//                 console.log(`${cid} : urlCreate050 API 오류`, index, VNO, res);
//                 if (res.emsg === "사용 중인 가상번호입니다.") {
//                   console.log(res.emsg);
//                   await serviesUsedSafeNumSetAdmin(VNO);
//                   reject(VNO); // 실패 시 reject 호출
//                 } else {
//                   reject(); // 실패 시 reject 호출
//                 }
//               }
//             } catch (error) {
//               console.error(`${cid} : API 요청 중 오류 발생`, error);
//               reject(); // 실패 시 reject 호출
//             }
//           } else {
//             console.log("모든 시도가 실패했습니다");
//             setLoading((res) => [...res, cid]);
//             setErrorWrap((res) => [...res, { cid: cid, message: message }]);
//             resolve(); // 성공 시 resolve 호출
//           }
//         }).catch((VNO) => {
//           // reject 시 attempt 증가 로직 추가
//           if (VNO) {
//             return safeNumSubmit(index, attempt);
//           } else {
//             return safeNumSubmit(index + 1, attempt + 1);
//           }
//         });
//       }
//     }

//     await safeNumSubmit(0);
//   } else {
//     TOA.servicesUseToast(
//       "개발서버, 테스트서버에선 안심번호 관리가 불가능합니다.",
//       "e"
//     );
//   }
// }

/**
 * 안심번호 대용량 업로드에서 사용되는 안심번호 등록
 * @param {*} cid
 * @param {*} data
 * @param {*} setLoading
 * @param {*} setErrorWrap
 * @param {*} setSuccessWrap
 */
export async function serviesSafeNumBigDataSetting(
  cid,
  data,
  setLoading,
  setErrorWrap,
  setSuccessWrap
) {
  if (APIURL.urlPrefix === "https://releaseawsback.gongsacok.com") {
    const MOBILE_NUM = data.mobilenum ? data.mobilenum : "";
    const TEL_NUM = data.telnum ? data.telnum : "";
    let message;

    const list = await serviesSafeNumSearch([]);

    async function safeNumSubmit(index, attempt = 0) {
      // 사용 가능한 안심번호가 있을 때
      if (list.length > 0) {
        return new Promise(async (resolve, reject) => {
          if (attempt < 2) {
            const VNO = list[index].replaceAll("-", "").toString();

            const RCVNO1 =
              MOBILE_NUM !== ""
                ? MOBILE_NUM.replaceAll("-", "").toString()
                : "";
            const RCVNO2 =
              TEL_NUM !== "" ? TEL_NUM.replaceAll("-", "").toString() : "";

            try {
              const res = await API.servicesPostData(APIURL.urlCreate050, {
                channelId: "wazzang",
                vno: VNO,
                vnoName: data.name,
                status: "Y",
                rcvNo1: RCVNO1 !== "" ? RCVNO1 : RCVNO2,
                rcvNo2: "",
                bizStartTime: "0000",
                bizEndTime: "2359",
                colorringIdx: 119158,
                rcvMentIdx: 119159,
                bizEndMentIdx: 119160,
                holiMentIdx: 119161,
                holiWeek: "11111",
                holiDay: "1111111",
                holidaySet: "N",
                recType: "0",
              });

              message = res.emsg;

              if (res && res.status === "success") {
                const companyDetailRes = await API.servicesPostData(
                  APIURL.urlSetCompanyDetail,
                  { rcid: cid, extnum: list[index] }
                );

                if (companyDetailRes && companyDetailRes.status === "success") {
                  // console.log(`${cid} : gooood`, index, VNO, res);
                  setLoading((res) => [...res, cid]);
                  setSuccessWrap((res) => [
                    ...res,
                    { cid: cid, message: `${list[index]}가 추가되었습니다.` },
                  ]);
                  resolve(); // 성공 시 resolve 호출
                  // reject(); // 실패 시 reject 호출
                }
              } else {
                console.log(`${cid} : urlCreate050 API 오류`, index, VNO, res);
                if (res.emsg === "사용 중인 가상번호입니다.") {
                  console.log(res.emsg);
                  await serviesUsedSafeNumSetAdmin(VNO);
                  reject(VNO); // 실패 시 reject 호출
                } else {
                  reject(); // 실패 시 reject 호출
                }
              }
            } catch (error) {
              console.error(`${cid} : API 요청 중 오류 발생`, error);
              reject(); // 실패 시 reject 호출
            }
          } else {
            console.log("모든 시도가 실패했습니다");
            setLoading((res) => [...res, cid]);
            setErrorWrap((res) => [...res, { cid: cid, message: message }]);
            resolve(); // 성공 시 resolve 호출
          }
        }).catch((VNO) => {
          // reject 시 attempt 증가 로직 추가
          if (VNO) {
            return safeNumSubmit(index, attempt);
          } else {
            return safeNumSubmit(index + 1, attempt + 1);
          }
        });
      }
    }

    await safeNumSubmit(0);
  } else {
    TOA.servicesUseToast(
      "개발서버, 테스트서버에선 안심번호 관리가 불가능합니다.",
      "e"
    );
  }
}

/**
 * 사업자 필수입력 페이지에서 사용되는 안심번호 등록
 * 사용 가능한 첫 번째 번호를 등록하고, 실패하면 다음 번호를 시도합니다.
 * @param {string} cid - 회사 ID
 * @param {string} realNum - 실제 번호
 * @param {string} telNum - 전화번호
 * @param {string} vnoName - 가상번호 이름
 * @param {string} ruid - 상태 값
 * @param {function} setLoading - 로딩 상태 업데이트 함수
 */
// export async function serviesSafeNumSetting(
//   cid,
//   realNum,
//   telNum,
//   vnoName,
//   ruid,
//   setLoading
// ) {
//   // 리얼 서버만 동작하도록 조건 추가
//   if (APIURL.urlPrefix !== "https://releaseawsback.gongsacok.com") {
//     return;
//   }

//   // 리얼 번호가 없거나 '9999-9999'로 끝나는 경우 전화번호를 사용
//   const primaryNumber =
//     !realNum || realNum.endsWith("9999-9999") ? telNum : realNum;

//   if (primaryNumber && !primaryNumber.endsWith("9999-9999")) {
//     setLoading(true);

//     const list = await serviesSafeNumSearch([], setLoading);

//     async function submitNumber(index, attempt = 0) {
//       if (index >= list.length) {
//         console.log("모든 시도가 실패했습니다");
//         setLoading(false);
//         return;
//       }

//       const VNO = list[index].replaceAll("-", "");
//       const RCVNO1 = primaryNumber.replaceAll("-", "");

//       try {
//         const res = await API.servicesPostData(APIURL.urlCreate050, {
//           channelId: "wazzang",
//           vno: VNO,
//           vnoName,
//           status: "Y",
//           rcvNo1: RCVNO1,
//           rcvNo2: "",
//           bizStartTime: "0000",
//           bizEndTime: "2359",
//           colorringIdx: 119158,
//           rcvMentIdx: 119159,
//           bizEndMentIdx: 119160,
//           holiMentIdx: 119161,
//           holiWeek: "11111",
//           holiDay: "1111111",
//           holidaySet: "N",
//           recType: "0",
//         });

//         if (res.status === "success") {
//           await API.servicesPostData(APIURL.urlSetCompanyDetail, {
//             rcid: cid,
//             extnum: list[index],
//             status: ruid ? 1 : 6,
//           });
//           console.log("완료됨ㅎ");
//           setLoading(false);
//         } else if (res.status === "fail") {
//           console.log("urlCreate050 API 오류", res);
//           return TOA.servicesUseToast(res.emsg, "e");
//         } else {
//           // 사용 중인 가상번호 오류가 발생하면 다음 번호 시도
//           if (res.emsg === "사용 중인 가상번호입니다.") {
//             await submitNumber(index + 1, attempt + 1);
//           } else {
//             return TOA.servicesUseToast(res.emsg, "e");
//           }
//         }
//       } catch (error) {
//         console.error("API 요청 중 오류 발생", error);
//         if (attempt < 2) {
//           await submitNumber(index, attempt + 1);
//         } else {
//           setLoading(false);
//         }
//       }
//     }

//     await submitNumber(0);
//   }
// }

/**
 * 사업자 필수입력 페이지에서 사용되는 안심번호 등록 (사용가능한 첫번째 번호 등록, 안 되면 그다음 번호 등록)
 * @param {*} cid
 * @param {*} realNum
 * @param {*} telNum
 * @param {*} vnoName
 * @param {*} setLoading
 */
export async function serviesSafeNumSetting(
  cid,
  realNum,
  telNum,
  vnoName,
  ruid,
  setLoading
) {
  // 리얼 서버만 동작하도록 조건 추가
  if (APIURL.urlPrefix === "https://releaseawsback.gongsacok.com") {
    let primaryNumber;
    // 9999-9999는 임시번호 이므로 안심번호를 생성하지 않는다.
    if (!realNum || realNum.endsWith("9999-9999")) {
      primaryNumber = telNum;
    } else {
      primaryNumber = realNum;
    }

    if (!primaryNumber.endsWith("9999-9999") && primaryNumber) {
      setLoading(true);
      const list = await serviesSafeNumSearch([], setLoading);

      async function safeNumSubmit(index, attempt = 0) {
        // 사용 가능한 안심번호가 있을 때
        if (list.length > 0) {
          if (index < list.length && attempt < 2) {
            const VNO = list[index].replaceAll("-", "").toString();
            const RCVNO1 = primaryNumber.replaceAll("-", "").toString();

            try {
              const res = await API.servicesPostData(APIURL.urlCreate050, {
                channelId: "wazzang",
                vno: VNO,
                vnoName: vnoName,
                status: "Y",
                rcvNo1: RCVNO1,
                rcvNo2: "",
                bizStartTime: "0000",
                bizEndTime: "2359",
                colorringIdx: 119158,
                rcvMentIdx: 119159,
                bizEndMentIdx: 119160,
                holiMentIdx: 119161,
                holiWeek: "11111",
                holiDay: "1111111",
                holidaySet: "N",
                recType: "0",
              });

              if (res?.status === "success") {
                await API.servicesPostData(APIURL.urlSetCompanyDetail, {
                  rcid: cid,
                  extnum: list[index],
                  status: ruid ? 1 : 6,
                });
                console.log("완료됨ㅎ");
                setLoading(false);
              } else if (res?.status !== "fail") {
                console.log("urlCreate050 API 오류", res);
                if (res.emsg === "사용 중인 가상번호입니다.") {
                  // 서버가 달라 발생하는 오류
                  safeNumSubmit(index + 1, attempt + 1);
                } else {
                  // 착신번호 규격 오류 등 for믄을 돌리지 않는 오루
                  return TOA.servicesUseToast(res.emsg, "e");
                }
              }
            } catch (error) {
              setLoading(false);
              console.error("API 요청 중 오류 발생", error);
              if (attempt < 2) {
                safeNumSubmit(index, attempt + 1);
              }
            }
          } else {
            // setLoading(false);
            console.log("모든 시도가 실패했습니다");
          }
        }
      }

      // if (realNum.endsWith("0000-0000")) {
      //   TOA.servicesUseToast("착신번호1 규격에 맞지 않습니다.", "e");
      //   return;
      // } else {
      // }
      await safeNumSubmit(0);
    }
  } else {
    return;
  }
}
