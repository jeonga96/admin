import Swal from "sweetalert2";

/**
 * 추가, 취소 버튼이 있는 모달창
 * @param {*} Title
 * @param {*} text
 * @param {*} fnOK : 추가 버튼 클릭 시 동작하는 함수
 * @param {*} fnClose : 취소 버튼 클릭 시 동작하는 함수
 */
export function servicesUseModalCsvUpload(Title, text, fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: Title,
      text: text,
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

/**
 * 덮어쓰기, 관리번호만 저장 버튼이 있는 모달창
 * @param {*} Title
 * @param {*} text
 * @param {*} fnOK : 덮어쓰기  버튼 클릭 시 동작하는 함수
 * @param {*} fnClose : 관리번호만 저장  버튼 클릭 시 동작하는 함수
 */
export function servicesUseModalSetCid(Title, text, fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: Title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "덮어쓰기",
      cancelButtonText: "관리번호만 저장",
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

/**
 * 상세정보 입력하기,안심번호 입력하기 버튼이 있는 모달창
 * @param {*} Title
 * @param {*} text
 * @param {*} fnOK : 상세정보 입력하기  버튼 클릭 시 동작하는 함수
 * @param {*} fnClose : 안심번호 입력하기  버튼 클릭 시 동작하는 함수
 */
export function servicesCompanyReqModal(Title, text, fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: Title,
      text: text,
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

/**
 * 상세정보 입력하기, 목록으로 가기 버튼이 있는 모달창
 * @param {*} Title
 * @param {*} text
 * @param {*} fnOK : 상세정보 입력하기
 * @param {*} fnClose : 목록으로 가기
 */
export function servicesUseModalSafeNum(Title, text, fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: Title,
      text: text,
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

/**
 * 안심번호 삭제 버튼이 있는 모달창
 * 사업자 상세 정보 페이지 > 비활성화 사용 시 안심번호 삭제 여부를 묻는 모달창
 * @param {*} Title
 * @param {*} text
 * @param {*} fnOK : 안심번호 삭제
 * @param {*} fnClose : 아니요
 */
export function servicesUseModalExtnumDelete(Title, text, fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: Title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "안심번호 삭제",
      cancelButtonText: "아니요",
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

/**
 * 정보 덮어쓰기 버튼이 있는 모달창
 * 사업자 필수 입력 > 회원 관리번호 연결 여부 묻기
 * @param {*} fnOK : 덮어쓰기
 * @param {*} fnClose : 아니요
 */
export function servicesUseModalLinkedUser(fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "회원 정보에 입력된 데이터를 덮어쓰기 하시겠습니까?",
      text: "기존에 입력된 값은 저장되지 않습니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "덮어쓰기",
      cancelButtonText: "아니요",
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

/**
 * 사업자 필수 입력, 안심번호 추가  버튼이 있는 모달창
 * @param {*} fnOK : 추가
 * @param {*} fnClose : 아니요
 */
export function servicesUseModalAddSafeNumg(fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "안심번호를 추가하시겠습니까?",
      text: "안심번호는 실제 서버에서만 추가됩니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "안심번호 추가",
      cancelButtonText: "아니요",
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

/**
 * 추가, 취소 버튼이 있는 모달창
 * @param {*} Title
 * @param {*} text
 * @param {*} fnOK : 추가 버튼 클릭 시 동작하는 함수
 * @param {*} fnClose : 취소 버튼 클릭 시 동작하는 함수
 */
export function servicesUseModalNoId(Title, text, fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: Title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "탈퇴요청",
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

/**
 * 활성화, 비활성화
 * @param {*} Title
 * @param {*} text
 * @param {*} fnOK : 추가 버튼 클릭 시 동작하는 함수
 * @param {*} fnClose : 취소 버튼 클릭 시 동작하는 함수
 */
export function servicesUseModalChooseUseFlag(Title, text, fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: Title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "활성화",
      cancelButtonText: "비활성화",
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

/**
 * 추가, 취소 버튼이 있는 모달창
 * @param {*} Title
 * @param {*} text
 * @param {*} fnOK : 추가 버튼 클릭 시 동작하는 함수
 * @param {*} fnClose : 취소 버튼 클릭 시 동작하는 함수
 */
export function servicesUseModalChooseId(Title, text, fnOK, fnClose) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: Title,
      text: text,
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

/**
 * 사업자 필수 입력, 안심번호 추가  버튼이 있는 모달창
 * @param {*} fnOK : 추가

 */
export function servicesRecordModalRemoveCk(fnOK) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "삭제된 데이터는 복구할 수 없습니다.",
      text: "현재 데이터를 삭제 하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "삭제",
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
        return;
      }
    });
}
