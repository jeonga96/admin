import { servicesPostData } from "./importData";
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
  const arrPushData = [];
  allData.filter((it) => {
    if (arrData.includes(it.keyword)) {
      return arrPushData.push(it);
    }
  });
  return variable(arrPushData);
}

// 안내창 라이브러리
export function servicesUseToast(text, type, fnOpen, fnClose) {
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

    case "undo":
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

// 안내창 라이브러리
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
