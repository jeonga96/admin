import * as TOA from "../library/toast";

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

  // if (!telnum && !mobilenum) {
  //   return ruid ? 2 : 4;
  // }

  // console.log(mobilenum, telnum, ruid, extnum);
  // extnum이 존재하면
  if (!!extnum) {
    console.log("1");
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
  const checkSafenum = () => {
    console.log("2", ruid);
    return ruid ? 1 : 6;
  };

  // mobilenum과 telnum이 둘 다 존재하지 않을 때
  if (!mobilenum && !telnum) {
    console.log("3");
    return 4; // 입력 필요
  }

  // mobilenum만 있을 때
  if (mobilenum && !telnum) {
    console.log(
      "1-2-",
      isSafeNumber(mobilenum) ? checkSafenum(mobilenum) : ruid ? 2 : 4
    );
    return isSafeNumber(mobilenum) ? checkSafenum(mobilenum) : ruid ? 2 : 4;
  }

  // telnum만 있을 때
  if (!mobilenum && telnum) {
    console.log("5");
    return isSafeNumber(telnum) ? checkSafenum(telnum) : ruid ? 2 : 4;
  }

  // 둘 다 있을 때
  if (isSafeNumber(mobilenum) && isSafeNumber(telnum)) {
    console.log("6");
    return checkSafenum(mobilenum);
  } else {
    console.log("7");
    return ruid ? 2 : 4; // 둘 중 하나라도 일반 번호일 경우 안심번호 생성
  }
}
