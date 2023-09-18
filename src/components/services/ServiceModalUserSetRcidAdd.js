import { useState } from "react";
import { useForm } from "react-hook-form";

import * as STR from "../../service/string";
import * as API from "../../service/api";
import * as UD from "../../service/useData";

export default function ServiceModalUserSetRcidAdd({ click, setClick, fn }) {
  const { register, getValues, watch } = useForm();
  const [list, setList] = useState([]);

  // 검색
  const fnSearch = (e) => {
    e.preventDefault();
    API.servicesPostData(STR.urlCompanylist, {
      offset: 0,
      size: 15,
      cid: getValues("_cid"),
      cdnamd: getValues("_cdnamd"),
      telnum: getValues("_telnum"),
      name: getValues("_name"),
    }).then((res) => {
      console.log(res);
      if (res.status === "fail") {
        UD.servicesUseToast("검색하신 데이터가 없습니다.", "e");
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
                <input type="text" id="cid" {...register("_cid")} />
              </div>
            </div>
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>사업자명</span>
              </label>
              <div>
                <input type="text" id="cdname" {...register("_cdname")} />
              </div>
            </div>
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>이름</span>
              </label>
              <div>
                <input type="text" id="name" {...register("_name")} />
              </div>
            </div>
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>번호</span>
              </label>
              <div>
                <input
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
            <button type="reset" value="초기화" onClick={() => setClick(false)}>
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
                  <th style={{ width: "121px" }}>사업자명</th>
                  <th style={{ width: "121px" }}>이름</th>
                  <th style={{ width: "121px" }}>번호</th>
                </tr>
              </thead>

              <tbody style={{ height: "100px" }}>
                {list.map((item) => (
                  <tr key={item.uid} onClick={() => fn(item)}>
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
