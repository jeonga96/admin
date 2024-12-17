// 사업자 상세정보 > 회원 관라정보 검색 모달

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import * as APIURL from "../../service/string/apiUrl";
import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";

export default function ServiceModalUserSetRcidAdd({ click, setClick, fn }) {
  const { register, getValues, watch } = useForm();
  const [list, setList] = useState([]);

  useEffect(() => {
    if (click) {
      API.servicesPostData(APIURL.urlUserlist, {
        offset: 0,
        size: 15,
        uid: "",
        userid: "",
        telnum: "",
        name: "",
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
    const requestData = {
      offset: 0,
      size: 15,
    };
    if (getValues("_uid")) {
      requestData.uid = getValues("_uid");
    }
    if (getValues("_userid")) {
      requestData.userid = getValues("_userid");
    }
    if (getValues("_mobile")) {
      requestData.mobile = getValues("_mobile");
    }
    if (getValues("_name")) {
      requestData.name = getValues("_name");
    }

    e.preventDefault();
    API.servicesPostData(APIURL.urlUserlist, requestData).then((res) => {
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
                <span>회원 관리번호</span>
              </label>
              <div>
                <input
                  onKeyDown={(e) => fnSearchEnter(e)}
                  type="text"
                  id="uid"
                  {...register("_uid")}
                />
              </div>
            </div>
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>아이디</span>
              </label>
              <div>
                <input
                  onKeyDown={(e) => fnSearchEnter(e)}
                  type="text"
                  id="userid"
                  {...register("_userid")}
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
                  id="mobile"
                  {...register("_mobile")}
                  value={
                    (watch("_mobile") &&
                      watch("_mobile")
                        .replace(/[^0-9]/g, "")
                        .replace(
                          /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)([0-9]{4}$)/,
                          "$1-$2-$3"
                        )
                        .replace(/^([0-9]{4})([0-9]{4})$/, "$1-$2")
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
                  <th style={{ width: "120px" }}>회원 관리번호</th>
                  <th style={{ width: "120px" }}>아이디</th>
                  <th style={{ width: "110px" }}>이름</th>
                  <th style={{ width: "135px" }}>번호</th>
                </tr>
              </thead>

              <tbody style={{ height: "216px" }}>
                {list.map((item) => (
                  <tr key={item.uid} onClick={() => fn(item)}>
                    <td style={{ width: "120px" }}>{item.uid}</td>
                    <td
                      style={{
                        width: "120px",
                        lineHeight: "2rem",
                        display: "inline-block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginTop: "-1px",
                      }}
                    >
                      {item.userid}
                    </td>
                    <td style={{ width: "110px" }}>{item.name}</td>
                    <td style={{ width: "135px" }}>
                      {!!item.mobile ? item.mobile : item.telnum}
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
