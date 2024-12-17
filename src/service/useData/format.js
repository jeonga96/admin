import * as SAFE from "./safenumber";

/**
 * 번호 입력 시 - 기호 자동 입력
 * @param {*} tell // 핸드폰, 일반번호 입력
 * @returns
 */
export const serviesFormatPhoneNumber = (tell) => {
  // 탭 문자 제거 및 숫자만 추출
  const cleaned = tell.replace(/^\t+/, "").replace(/[^0-9]/g, "");

  if (cleaned.match(/^(010|011|016|017|018|019)\d{7,8}$/)) {
    // 010, 011, 016, 017, 018, 019 패턴의 번호 (휴대폰 번호)
    return cleaned.replace(/^(01[016789])(\d{3,4})(\d{4})$/, "$1-$2-$3");
  } else if (cleaned.match(/^050[5-7]\d{7,8}$/)) {
    // 0505, 0506, 0507 패턴의 번호 (안심번호)
    return cleaned.replace(/^(050[5-7])(\d{4})(\d{4})$/, "$1-$2-$3");
  } else if (cleaned.match(/^02\d{7,8}$/)) {
    // 02 전화번호
    return cleaned.replace(/^(02)(\d{3,4})(\d{4})$/, "$1-$2-$3");
  } else if (cleaned.match(/^(1[0-9][0-9][0-9])\d{4}$/)) {
    // 15--, 16--
    return cleaned.replace(/^(1[0-9][0-9][0-9])(\d{4})$/, "$1-$2");
  } else if (cleaned.match(/^(0[3-9][0-9])\d{7,8}$/)) {
    // 일반 전화번호 (지역 번호 포함)
    return cleaned.replace(/^(0[3-9][0-9]?)(\d{3,4})(\d{4})$/, "$1-$2-$3");
  } else if (cleaned.match(/^(15[0-9]|16[0-9])\d{4}$/)) {
    // 15--, 16-- (특정 번호 포함)
    return cleaned.replace(/^(15[0-9]|16[0-9])(\d{4})$/, "$1-$2");
  } else {
    // 그 외의 번호는 그대로 반환
    return tell;
  }
};

/**
 * 숫자 데이터를 4자리마다 나눈 후 두번째 "-" 이후 반환
 * 1234567890 -> 1234-5678
 * @param {*} number
 * @returns
 */
export function serviesNumberSlice4AndRmove4(number) {
  const inputString = SAFE.serviesNumberSlice4(number);
  const indexOfSecondHyphen = inputString.indexOf(
    "-",
    inputString.indexOf("-") + 1
  );

  return inputString.substring(0, indexOfSecondHyphen);
}

/**
 * 배열 내부 [boolan] -> [0,1]
 * @param {*} arr
 * @returns
 */
export function serviesBoolToNumberInArr(arr) {
  const newArr = [];
  arr.forEach((el) => (el ? newArr.push(1) : newArr.push(0)));
  return newArr.toString().replaceAll(",", "");
}

/**
 * int -> boolan
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
 * 1200 -> 12:00
 * @param {*} str
 * @returns
 */
export function serviesStringToTime(str) {
  return `${str.slice(0, 2)}:${str.slice(2, 4)}`;
}

/**
 * Wed Sep 27 2023 14:02:10 GMT+0900 -> 2023-09-27T05:02:33.556Z
 * @param {*} date
 * @returns
 */
export function serviesDatetoISOString(date) {
  const dt = date ? new Date(date) : new Date();

  const offset = new Date().getTimezoneOffset() * 60000;
  const today = new Date(dt - offset);
  return today.toISOString();
}
