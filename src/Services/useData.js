import { servicesPostData } from "./importData";

export function servicesGetImgsIid(variable, data) {
  for (let i = 0; i < data.length; i++) {
    variable.push(data[i].iid);
  }
}

export function serviesPostDataSettingRcid(url, valueName, setData) {
  servicesPostData(url, { rcid: valueName }).then((res) => {
    if (res.status === "success") {
      setData(res.data);
      console.log(res.data);
      return;
    }
    if (res.status === "fail" && res.emsg === "process failed.") {
      setData([]);
      console.log("작성된 내용이 없습니다.", res);
      return;
    }
  });
}
