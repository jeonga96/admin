import * as TOA from "./toast";
import * as API from "./api";
import * as STR from "./string";
import * as UD from "./useData";
import * as MO from "./modal";

/**
 * postApi를 이용한다. api를 불러오는데 실패하면 빈 배열을 반환한다.
 * @param {*} url
 * @param {*} valueName : {key:value}
 * @param {*} setData : setState
 */
export function serviesPostDataState(url, valueName, setData) {
  API.servicesPostData(url, valueName).then((res) => {
    if (res.status === "success") {
      setData(res.data);
      return;
    }
    if (res.status === "fail" && res.emsg === "process failed.") {
      setData([]);
      return;
    }
  });
}

/**
 * 서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
 * @param {*} variable iid가 저장된 배열
 * @param {*} data iid strint 타입을 저장할 useState, Selector
 */
export function serviesGetImgsIid(variable, data) {
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      variable.push(data[i]?.iid);
    }
  } else {
    variable = [];
  }

  return variable;
}

/**
 * []내부에 blooean타입의 데이터를 0,1로 이루어진 string타입으로 변경
 * @param {*} arr
 * @returns
 */
export function serviesBoolToNumber(arr) {
  const newArr = [];
  arr.forEach((el) => (el ? newArr.push(1) : newArr.push(0)));
  return newArr.toString().replaceAll(",", "");
}

/**
 * 숫자 데이터를 boolan 타입으로 변경
 * @param {*} arr
 * @returns
 */
export function serviesNumberToBool(arr) {
  const binaryArray = arr.split("");
  const booleanArray = binaryArray.map((digit) => {
    return digit === "1";
  });
  return booleanArray;
}

/**
 * 시간 형식으로 값을 변경해준다. 0000 -> 00:00
 * @param {*} str
 * @returns
 */
export function serviesStringToTime(str) {
  return `${str.slice(0, 2)}:${str.slice(2, 4)}`;
}

/**
 * Date 타입의 데이터를 toISOString타입으로 변경해준다.
 * Wed Sep 27 2023 14:02:10 GMT+0900 -> 2023-09-27T05:02:33.556Z
 * @param {*} date
 * @returns
 */
export function serviesDatetoISOString(date) {
  const dt = new Date(date);
  return dt.toISOString();
}

/**
 * 숫자 데이터를 4자리 마댜 나눈 후 사이에 "-" 넣기
 * @param {*} number
 * @returns
 */
export function serviesNumberSlice4(number) {
  const str = number.toString();
  let result = "";

  for (let i = 0; i < str.length; i += 4) {
    result += str.slice(i, i + 4) + "-";
  }

  return result.slice(0, -1);
}

/**
 * -가 없는 값을 넣은 뒤 자동으로 -가 입력된 번호가 나오도록 설정
 * @param {*} number
 * @returns
 */
function formatPhoneNumber(number) {
  if (number.length === 11 && number.startsWith("010")) {
    // 010으로 시작하고 길이가 11인 경우 (휴대폰)
    return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (number.length === 11) {
    // 010으로 시작하지 않고 길이가 11인 경우
    return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (number.length === 10) {
    // 길이가 10인 경우 (일반 전화번호)
    return number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else if (number.length === 9) {
    // 길이가 9인 경우
    return number.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3");
  } else if (number.length === 8) {
    // 길이가 8인 경우 (대표 번호)
    return number.replace(/(\d{4})(\d{4})/, "$1-$2");
  } else {
    // 다른 경우는 그대로 반환
    return number;
  }
}

/**
 * 숫자 데이터를 4자리마다 나눈 후 두번째 "-" 이후를 자르기
 * @param {*} number
 * @returns
 */
export function serviesNumberSlice4AndRmove4(number) {
  const inputString = serviesNumberSlice4(number);
  const indexOfSecondHyphen = inputString.indexOf(
    "-",
    inputString.indexOf("-") + 1
  );

  return inputString.substring(0, indexOfSecondHyphen);
}

/**
 * 사용할 수 있는 안심번호 총 목록 만들기
 * @returns
 */
export function serviesGnerateNumbers() {
  const numbers = [];

  // 가장 처음 할당 받은 안심번호 1,000개
  //0507-0176-9000
  const startNumber1 = "050701769000";
  const FIRSTNUM = Number(startNumber1.slice(-4));
  for (let i = FIRSTNUM; i < FIRSTNUM + STR.FIRST_SAFENUM_1000; i++) {
    const formattedNumber = String(i).padStart(4, "0").slice(-4);
    const newSlice4 = serviesNumberSlice4AndRmove4(startNumber1);
    numbers.push(`${newSlice4}-${formattedNumber}`);
  }

  // 추가 번호 요청하여 받은 안심번호 10,000개
  //0507-0181-0000
  const startNumber2 = "050701810000";
  for (let i = 0; i < STR.SECOND_SAFENUM_10000; i++) {
    const formattedNumber = String(i).padStart(4, "0").slice(-4);
    const newSlice4 = serviesNumberSlice4AndRmove4(startNumber2);
    numbers.push(`${newSlice4}-${formattedNumber}`);
  }

  // 추가 번호 요청하여 받은 안심번호 10,000개
  //0507-0175-0000
  const startNumber3 = "050701750000";
  for (let i = 0; i < STR.SECOND_SAFENUM_10000; i++) {
    const formattedNumber = String(i).padStart(4, "0").slice(-4);
    const newSlice4 = serviesNumberSlice4AndRmove4(startNumber3);
    numbers.push(`${newSlice4}-${formattedNumber}`);
  }

  // 추가 번호 요청하여 받은 안심번호 10,000개
  // 0507 - 0440 - 0000;
  // const startNumber4 = "050704400000";
  // for (let i = 0; i < STR.SECOND_SAFENUM_10000; i++) {
  //   const formattedNumber = String(i).padStart(4, "0").slice(-4);
  //   const newSlice4 = serviesNumberSlice4AndRmove4(startNumber4);
  //   numbers.push(`${newSlice4}-${formattedNumber}`);
  // }

  return numbers;
}

/**
 * 새로고침
 * @returns
 */
export function serviesReload() {
  return document.location.reload();
}

/**
 * 2초 뒤에 새로고침 하기
 */
export function serviesAfter2secondReload() {
  setTimeout(() => {
    return document.location.reload();
  }, 2000);
}

/**
 * startNumber부터 count(현재 할당받은 10000개의 안심번호)까지 배열 생성
 * @param {*} setList
 * @param {*} setLoading
 * @returns
 */
export async function serviesSafeNumSearch(setList, setLoading) {
  // const startNumber = "050701769000";
  let useSearchSafeNum = [];

  if (!!setLoading) {
    setLoading(true);
  }
  try {
    const res = await API.servicesPostData(STR.urlCompanylist, {
      offset: 0,
      size: STR.FIRST_SAFENUM_1000 + STR.SECOND_SAFENUM_10000 * 2,
      telnum: "0507",
    });

    if (res.status === "fail") {
      TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
    } else if (res.status === "success") {
      useSearchSafeNum.push(...res.data);
      const SafeNumber = UD.serviesGnerateNumbers();
      const filterNumber = SafeNumber.filter(
        (number) =>
          !useSearchSafeNum.some((obj) => obj.extnum === number.toString())
      );
      console.log("filterNumber :", filterNumber);
      if (
        filterNumber.length >=
        STR.FIRST_SAFENUM_1000 + STR.SECOND_SAFENUM_10000 * 2
      ) {
        alert("할당된 안심번호를 모두 사용하였습니다.");
      } else {
        return typeof setList == "object"
          ? filterNumber
          : setList([...filterNumber]);
      }
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * 안심번호 서버(959biz)와 공사콕 서버에서 사용가능한 안심번호 불일치로 인한 오류 해결 함수
 *  if ("사용 중인 가상번호입니다.") = 공사콕 사업자 목록에는 있고, 안심번호 서버에는 저장되지 않은 경우
 * @param {*} VNO
 */
export async function serviesUsedSafeNumSetAdmin(VNO) {
  console.log("사용 중인 가상번호입니다.");

  try {
    const RES_Get050 = await API.servicesPostData(STR.urlGet050, { vno: VNO });
    if (RES_Get050.status === "success") {
      // 안심번호가 저장되어 있음 & 안심번호에 저장된 착신번호 1로 공사콕 조회했을 때 조회됨
      const RES_CompanyList = await API.servicesPostData(STR.urlCompanylist, {
        offset: 0,
        size: 5,
        telnum: formatPhoneNumber(RES_Get050.data.rcvNo1),
        vnoName: RES_Get050.data.vnoName,
      });

      if (RES_CompanyList.status === "success") {
        console.log("2", RES_Get050);
        console.log("2", RES_Get050.data.rcvNo1, RES_CompanyList);

        // RES_CompanyList.data가 배열인지 객체인지 확인
        const companies = Array.isArray(RES_CompanyList.data)
          ? RES_CompanyList.data
          : [RES_CompanyList.data];

        for (const company of companies) {
          console.log(company, company.extnum);
          // 저장된 안심번호 값이 있을 때
          if (!!company?.extnum) {
            // if (!!company?.extnum || RES_CompanyList.status === "fail") {
            console.log("저장된 안심번호 값이 있을 때");

            // cid에 등록된 안심번호가 내가 검색하고 싶은 안심번호에 적인 것과 다르다면
            // 안심번호 서버에 저장된 번호 삭제
            if (company.extnum !== serviesNumberSlice4(VNO)) {
              await API.servicesPostData(STR.urlClear050, { vno: VNO });
              await API.servicesPostData(STR.urlSetCompanyDetail, {
                cid: company.cid,
                extnum: "",
              });
            }
          }
          // 저장된 안심번호 값이 없을 때
          else {
            await API.servicesPostData(STR.urlClear050, { vno: VNO });
            await API.servicesPostData(STR.urlSetCompanyDetail, {
              cid: company.cid,
              extnum: "",
            });
          }
        }
      }

      // 안심번호가 저장되어 있음 & 안심번호에 저장된 착신번호 1로 공사콕 조회했을 때 조회되지 않음
      if (RES_CompanyList.status === "fail") {
        await API.servicesPostData(STR.urlClear050, { vno: VNO });
        TOA.servicesUseToast("오류가 발생됐습니다. 다시 저장해주세요.", "e");
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

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
  if (STR.urlPrefix === "https://releaseawsback.gongsacok.com") {
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
              const res = await API.servicesPostData(STR.urlCreate050, {
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
                await API.servicesPostData(STR.urlSetCompanyDetail, {
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
/**
 * 안심번호(extnum)가 연결되지 않은 상황에서 해당 함수 사용
 * @param {*} mobilenum
 * @param {*} telnum
 * @param {*} ruid
 * @param {*} extnum
 */
export function serviesCheckSafeNum(mobilenum, telnum, ruid, extnum) {
  // 1 : 완료
  // 2 : 대기
  // 4 : 생성
  // 6 : 입력

  // extnum이 존재하면
  if (!!extnum) {
    return ruid ? 1 : 6;
  }

  // 안심번호 체크 함수
  const isSafeNumber = (num) => {
    return (
      num.startsWith("050") ||
      num.startsWith("080") ||
      num.startsWith("15") ||
      num.startsWith("16") ||
      num.startsWith("18") ||
      num.startsWith("02-15") ||
      num.startsWith("02-16") ||
      num.startsWith("02-18")
    );
  };

  // 안심번호 생성 체크 함수
  const checkSafenum = (num) => {
    return ruid ? 1 : 6;
  };

  // mobilenum과 telnum이 둘 다 존재하지 않을 때
  if (!mobilenum && !telnum) {
    return 6; // 입력 필요
  }

  // mobilenum만 있을 때
  if (mobilenum && !telnum) {
    return isSafeNumber(mobilenum) ? checkSafenum(mobilenum) : ruid ? 2 : 4;
  }

  // telnum만 있을 때
  if (!mobilenum && telnum) {
    return isSafeNumber(telnum) ? checkSafenum(telnum) : ruid ? 2 : 4;
  }

  // 둘 다 있을 때
  if (isSafeNumber(mobilenum) && isSafeNumber(telnum)) {
    return checkSafenum(mobilenum);
  } else {
    return ruid ? 2 : 4; // 둘 중 하나라도 일반 번호일 경우 안심번호 생성
  }
}

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
  if (STR.urlPrefix === "https://releaseawsback.gongsacok.com") {
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
              const res = await API.servicesPostData(STR.urlCreate050, {
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
                  STR.urlSetCompanyDetail,
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
 * uid와 cid를 연결하기 위해 연결 여부 확인 후 cid 선택
 * @param {*} res
 * @param {*} setClick
 */
export function fnSelectCid(res, setClick) {
  API.servicesPostData(STR.urlGetCompany, {
    cid: res.cid,
  })
    .then((res) => {
      if (!res || !res.data) {
        console.error("Invalid response:", res);
        TOA.servicesUseToast("회원 연결이 되지 않은 사업자 회원입니다.", "e");
        return "";
      }
      const UID = res.data.ruid;
      if (!UID) {
        TOA.servicesUseToast("회원 연결이 되지 않은 사업자 회원입니다.", "e");
        return "";
      } else {
        setClick(false);
        console.log(UID);
        return UID;
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

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
  API.servicesPostData(STR.urlGetCompany, {
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

/**
 *itid가 두번 사용되지 않도록 설정
 * @param {*} item 선택된 값
 * @param {*} setState 저장할 state 함수
 * @param {*} state 저장된 state=
 */
export const serviesUniqueItid = (item, setState, state) => {
  const addImgs = [...state, item];
  setState((prevImages) => {
    const uniqueImages = addImgs.filter(
      (img, index, self) => index === self.findIndex((t) => t.itid === img.itid)
    );
    return uniqueImages;
  });
};

/**
 * iid가 두번 사용되지 않도록 설정
 * @param {*} imgs 기존 값
 * @param {*} setState 저장할 state 함수
 * @param {*} state 저장된 state=
 */
export const serviesUniqueIid = (imgs, setState, state) => {
  const addImgs = [...imgs, ...state];
  setState((prevImages) => {
    const uniqueImages = addImgs.filter(
      (img, index, self) => index === self.findIndex((t) => t.iid === img.iid)
    );
    return uniqueImages;
  });
};

/**
 * name이 두번 사용되지 않도록 설정
 * @param {*} Names 기존 값
 * @param {*} setState 저장할 state 함수
 * @param {*} state 저장된 state=
 */
export const serviesUniqueName = (Names, setState, state) => {
  const addNames = [...Names, ...state];
  setState((prevImages) => {
    const uniqueImages = addNames.filter(
      (img, index, self) =>
        index === self.findIndex((t) => t.file.name === img.file.name)
    );
    return uniqueImages;
  });
};

/**
 * data (serviceGetedData 등) reducer 빈 값으로 만들기
 * @param {*} dispatch
 */
export const serviesCleanup = (dispatch) => {
  console.log("cleanup!");
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
 * page reduver 빈 값으로 만들기
 * @param {*} dispatch
 */
export const serviesPaginationCleanup = (dispatch) => {
  console.log("serviesPaginationCleanup!");
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

export const serviesPasswdCheck = (id, pw) => {
  if (id === pw) {
    TOA.servicesUseToast("아이디와 동일한 비밀번호 입니다.", "e");
    return false;
  } else if (id.length < 4) {
    TOA.servicesUseToast("4자 이상으로 입력해주세요.", "e");
    return false;
  } else if (!/^([a-zA-Z0-9]){4,16}$/g.test(id)) {
    TOA.servicesUseToast("아이디는 영문, 숫자민 입력 가능합니다.", "e");
    return false;
  }
  // 길이 검사
  else if (pw.length < 6) {
    TOA.servicesUseToast("비밀번호를 6자 이상으로 입력해주세요.", "e");
    return false;
  }
  // 영문, 숫자, 특수문자 검사
  else if (!/^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/g.test(pw)) {
    TOA.servicesUseToast(
      "비밀번호에 영문, 숫자를 한 개 이상 입력해 주세요.",
      "e"
    );
    return false;
  } else {
    return true;
  }
};

export const serviesSetToken = (cid) => {
  API.servicesPostData(STR.urlSettoken, { cid: cid }).then((res) => {
    console.log("serviesSetToken :", cid);
    console.log("serviesSetToken :", res);
    if (res?.status === "success") {
      TOA.servicesUseToast("완료되었습니다.", "s");
    }
  });
};

export const serviesFormatPhoneNumber = (phoneNumber) => {
  // 탭 문자 제거 및 숫자만 추출
  const cleaned = phoneNumber.replace(/^\t+/, "").replace(/[^0-9]/g, "");

  if (cleaned.match(/^(010|011|016|017|018|019)\d{7,8}$/)) {
    // 010, 011, 016, 017, 018, 019 패턴의 번호 (휴대폰 번호)
    return cleaned.replace(/^(01[016789])(\d{3,4})(\d{4})$/, "$1-$2-$3");
  } else if (cleaned.match(/^050[5-7]\d{7,8}$/)) {
    // 0505, 0506, 0507 패턴의 번호 (안심번호)
    return cleaned.replace(/^(050[5-7])(\d{4})(\d{4})$/, "$1-$2-$3");
  } else if (cleaned.match(/^(02|0[3-9][0-9])\d{7,8}$/)) {
    // 일반 전화번호 (지역 번호 포함)
    return cleaned.replace(/^(0[2-9][0-9]?)(\d{3,4})(\d{4})$/, "$1-$2-$3");
  } else {
    // 그 외의 번호는 그대로 반환
    return phoneNumber;
  }
};
