/**
 * 로컬스토리지에 키와 값 저장
 * @param {*} name
 * @param {*} data
 * @returns
 */
export function servicesSetStorage(name, data) {
  return localStorage.setItem(name, data);
}

/**
 * 로컬스토리지에 저장된 값을 키를 이용하여 가져옴
 * @param {*} name
 * @returns
 */
export function servicesGetStorage(name) {
  return localStorage.getItem(name);
}

/**
 * 로컬스토리지에 저장된 값을 키를 이용하여 삭제
 * @param {*} name
 * @returns
 */
export function servicesRemoveStorage(name) {
  return localStorage.removeItem(name);
}
