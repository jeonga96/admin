export function serviceGetedData(payload) {
  return {
    type: "serviceGetedData",
    payload: payload,
  };
}

export function serviceGetedSummaryData(payload) {
  return {
    type: "serviceGetedSummaryData",
    payload: payload,
  };
}

export function serviceWriteData(payload) {
  return {
    type: "serviceWriteData",
    payload: payload,
  };
}

export function serviceMultilAddressData(payload) {
  return {
    type: "serviceMultilAddressData",
    payload: payload,
  };
}
