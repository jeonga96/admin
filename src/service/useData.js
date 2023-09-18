import { servicesPostData } from "./api";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export function serviesPostDataSettingRcid(url, valueName, setData) {
  servicesPostData(url, { rcid: valueName }).then((res) => {
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

//서버에 imgs의 iid값만을 보내기 위해 실행하는 반복문 함수
export function serviesGetImgsIid(variable, data) {
  for (let i = 0; i < data.length; i++) {
    variable.push(data[i].iid);
  }
}

//서버에 imgs의 imgid만 보내기 위하여 보내기 위해 실행하는 반복문 함수
export function serviesGetImgId(variable, data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].imgid) {
      variable.push(data[i].imgid);
    }
  }
}

//서버에 keywords의 keyword 데이터를 보내기 위해 실행하는 함수
export function serviesGetKeywords(variable, data) {
  for (let i = 0; i < data.length; i++) {
    variable.push(data[i].keyword);
  }
}

//서버에 keywords의 keyword 데이터를 보내기 위해 실행하는 함수
export function serviesGetKid(variable, data, allData) {
  const arrData = data !== undefined ? data.split(",") : [];
  const arrPushData = allData.filter((it) => arrData.includes(it.keyword));
  return variable(arrPushData);
}

export function serviesBoolToNumber(arr) {
  const newArr = [];
  arr.forEach((el) => (el ? newArr.push(1) : newArr.push(0)));
  return newArr.toString().replaceAll(",", "");
}

export function serviesNumberToBool(arr) {
  const binaryArray = arr.split("");
  const booleanArray = binaryArray.map((digit) => {
    return digit === "1";
  });
  return booleanArray;
}

export function serviesStringToTime(str) {
  return `${str.slice(0, 2)}:${str.slice(2, 4)}`;
}

// 안내창 라이브러리
export function servicesUseToast(text, type) {
  switch (type) {
    case "s":
      toast.success(text, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      break;

    case "e":
      toast.error(text, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      break;

    default:
      toast.warn(text, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  }
}

// 안내창 라이브러리 : SetRequiredCompany에서 사용
export function servicesUseModal(Q, SQ, fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: Q,
      text: SQ,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "상세정보 입력하기",
      cancelButtonText: "안심번호 입력하기",
      reverseButtons: true,
      customClass: {
        actions: "servicesUseModal",
        cancelButton: "no",
        confirmButton: "yes",
        // denyButton: "order-3",
      },
    })
    .then((result) => {
      if (result.isConfirmed) {
        fnOK();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        fnClose();
      }
    });
}

// 안내창 라이브러리 : SetRequiredCompany에서 사용
export function servicesUseModalSafeNum(Q, SQ, fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: Q,
      text: SQ,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "상세정보 입력하기",
      cancelButtonText: "목록으로 가기",
      reverseButtons: true,
      customClass: {
        actions: "servicesUseModal",
        cancelButton: "no",
        confirmButton: "yes",
        // denyButton: "order-3",
      },
    })
    .then((result) => {
      if (result.isConfirmed) {
        fnOK();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        fnClose();
      }
    });
}

// 안내창 라이브러리 : SetRequiredCompany에서 사용
export function servicesUseModalCsvUpload(Q, SQ, fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: Q,
      text: SQ,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "추가",
      cancelButtonText: "취소",
      reverseButtons: true,
      customClass: {
        actions: "servicesUseModal",
        cancelButton: "no",
        confirmButton: "yes",
      },
    })
    .then((result) => {
      if (result.isConfirmed) {
        fnOK();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        fnClose();
      }
    });
}

export function serviesDatetoISOString(date) {
  const dt = new Date(date);
  return dt.toISOString();
}

// 4자리 나눈 후 "-" 넣기
export function serviesNumberSlice4(number) {
  const str = number.toString();
  let result = "";

  for (let i = 0; i < str.length; i += 4) {
    result += str.slice(i, i + 4) + "-";
  }

  return result.slice(0, -1);
}

// 4자리마다 나눈 후 두번째 "-" 이후 자르기
export function serviesNumberSlice4AndRmove4(number) {
  const inputString = serviesNumberSlice4(number);
  const indexOfSecondHyphen = inputString.indexOf(
    "-",
    inputString.indexOf("-") + 1
  );

  return inputString.substring(0, indexOfSecondHyphen);
}

// 4자리마다 나눈 후 두번째째 "-" 이후 자른 string뒤에 startNumber부터 count까지의 글자 붙이기
export function gserviesGnerateNumbers(startNumber, count) {
  const numbers = [];
  const FORSTARTNUM = Number(startNumber.slice(-4));
  for (let i = Number(startNumber.slice(-4)); i < count + FORSTARTNUM; i++) {
    const formattedNumber = String(i).padStart(4, "0");
    const newSlice4 = serviesNumberSlice4AndRmove4(startNumber);
    numbers.push(`${newSlice4}-${formattedNumber}`);
  }
  return numbers;
}

export function serviesReload() {
  return document.location.reload();
}

export function serviesAfter2secondReload() {
  setTimeout(() => {
    return document.location.reload();
  }, 2000);
}

// const updateListItem = (index, newValue) => {
//   setListItems((prevListItems) => {
//     const newListItems = [...prevListItems]; // 기존 배열 복사
//     newListItems[index] = newValue; // 해당 인덱스의 값을 변경
//     return newListItems;
//   });
// };
