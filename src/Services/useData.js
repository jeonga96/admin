import { servicesPostData } from "./importData";

export function serviesPostDataSettingRcid(url, valueName, setData) {
  servicesPostData(url, { rcid: valueName }).then((res) => {
    if (res.status === "success") {
      setData(res.data);
      console.log(res.data);
      return;
    }
    if (res.status === "fail" && res.emsg === "process failed.") {
      setData([]);
      // console.log("작성된 내용이 없습니다.", res);
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
