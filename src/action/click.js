export function serviceClick(payload) {
  console.log("serviceClick!");
  return {
    type: "serviceClick",
    payload: payload,
  };
}

export function serviceModalClick(payload) {
  console.log("serviceModalClick!");
  return {
    type: "serviceModalClick",
    payload: payload,
  };
}
