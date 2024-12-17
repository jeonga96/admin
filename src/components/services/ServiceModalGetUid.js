import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import * as APIURL from "../../service/string/apiUrl";
import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";

export default function ServiceModalGetUid({ click, setClick, fn }) {
  const { register, getValues, watch } = useForm();
  const [list, setList] = useState([]);

  useEffect(() => {
    if (click) {
      API.servicesPostData(APIURL.urlCompanylist, {
        offset: 0,
        size: 30,
      }).then((res) => {
        console.log(res);
        if (res.status === "fail") {
          TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
        }
        if (res.status === "success") {
          setList(res.data);
        }
      });
    }
  }, [click]);

  function fnSearchEnter(f) {
    if (f.keyCode == 13) {
      fnSearch(f);
    }
  }
  // 검색
  const fnSearch = (e) => {
    e.preventDefault();
    API.servicesPostData(APIURL.urlCompanylist, {
      offset: 0,
      size: 30,
      cid: getValues("_cid"),
      cdname: getValues("_cdname"),
      telnum: getValues("_telnum"),
      name: getValues("_name"),
    }).then((res) => {
      console.log(res);
      if (res.status === "fail") {
        TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
      }
      if (res.status === "success") {
        setList(res.data);
      }
    });
  };

  return (
    click && (
      <>
        <div className="clickModal">
          <div className="listSearchForm formLayout">
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>사업자 관리번호</span>
              </label>
              <div>
                <input
                  onKeyDown={(e) => fnSearchEnter(e)}
                  type="text"
                  id="cid"
                  {...register("_cid")}
                />
              </div>
            </div>
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>상호명</span>
              </label>
              <div>
                <input
                  onKeyDown={(e) => fnSearchEnter(e)}
                  type="text"
                  id="cdname"
                  {...register("_cdname")}
                />
              </div>
            </div>
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>이름</span>
              </label>
              <div>
                <input
                  onKeyDown={(e) => fnSearchEnter(e)}
                  type="text"
                  id="name"
                  {...register("_name")}
                />
              </div>
            </div>
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>번호</span>
              </label>
              <div>
                <input
                  onKeyDown={(e) => fnSearchEnter(e)}
                  type="text"
                  id="telnum"
                  {...register("_telnum")}
                  value={
                    (watch("_telnum") &&
                      watch("_telnum")
                        .replace(/[^0-9]/g, "")
                        .replace(
                          /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                          "$1-$2-$3"
                        )
                        .replace("--", "-")) ||
                    ""
                  }
                />
              </div>
            </div>
          </div>

          <div
            className="listSearchButtonWrap"
            style={{ marginBottom: "14px" }}
          >
            <button type="reset" onClick={() => setClick(false)}>
              닫기
            </button>
            <button type="submit" value="검색" onClick={fnSearch}>
              검색
            </button>
          </div>

          <section className="tableWrap">
            <h3 className="blind">회원관리 리스트</h3>
            <table className="commonTable">
              <thead>
                <tr>
                  <th style={{ width: "121px" }}>사업자 관리번호</th>
                  <th style={{ width: "121px" }}>상호명</th>
                  <th style={{ width: "121px" }}>이름</th>
                  <th style={{ width: "121px" }}>번호</th>
                </tr>
              </thead>

              <tbody style={{ height: "216px" }}>
                {list.map((item) => (
                  <tr key={item.cid} onClick={() => fn(item)}>
                    <td style={{ width: "121px" }}>{item.cid}</td>
                    <td style={{ width: "121px" }}>{item.cdname}</td>
                    <td style={{ width: "121px" }}>{item.name}</td>
                    <td style={{ width: "121px" }}>
                      {!!item.mobilenum ? item.mobilenum : item.telnum}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </>
    )
  );
}
