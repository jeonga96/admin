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
 * 2초 뒤에 새로고침 하기
 */
export function serviesAfter1secondReload() {
  setTimeout(() => {
    return document.location.reload();
  }, 1000);
}
