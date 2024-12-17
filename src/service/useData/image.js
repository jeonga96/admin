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
