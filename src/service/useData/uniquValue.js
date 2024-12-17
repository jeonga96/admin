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
