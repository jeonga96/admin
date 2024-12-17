import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

export default function ServiceModalsealManager({ fn, click, setClick }) {
  const { register, getValues, watch } = useForm();
  const [prevUserList, setPrevUserList] = useState([]);

  function fnSearchEnter(f) {
    if (f.keyCode == 13) {
      fnSearch(f);
    }
  }

  // 검색
  const fnSearch = (e) => {
    e.preventDefault();

    const requestData = {
      offset: 0,
      size: 15,
    };

    if (getValues("_afflname")) {
      requestData.afflname = getValues("_afflname");
    }
    if (getValues("_cname")) {
      requestData.cname = getValues("_cname");
    }
    if (getValues("_phonenum")) {
      requestData.phonenum = getValues("_phonenum");
    }

    if (getValues("_name")) {
      requestData.name = getValues("_name");
    }

    API.servicesPostData(APIURL.urlListDistribution, requestData).then(
      (res) => {
        setPrevUserList([]);
        if (res.status === "fail") {
          TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
        }
        if (res.status === "success") {
          console.log("fnSearch :", res);
          setPrevUserList(res.data);
        }
      }
    );
  };

  useEffect(() => {
    API.servicesPostData(APIURL.urlListDistribution, {
      offset: 0,
      size: 150,
    }).then((res) => {
      console.log("useEffect", res);
      if (res.status === "success") {
        setPrevUserList(res.data.filter((item) => !!item.name));
      }
    });
  }, []);

  return (
    click && (
      <>
        <div className="clickModal">
          <div className="listSearchForm formLayout">
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>소속</span>
              </label>
              <div>
                <input
                  onKeyDown={(e) => fnSearchEnter(e)}
                  type="text"
                  id="afflname"
                  {...register("_afflname")}
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
                  id="cname"
                  {...register("_cname")}
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
                <span>휴대폰</span>
              </label>
              <div>
                <input
                  onKeyDown={(e) => fnSearchEnter(e)}
                  type="text"
                  id="phonenum"
                  {...register("_phonenum")}
                  value={
                    (watch("_phonenum") &&
                      watch("_phonenum")
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
            <h3 className="blind">table</h3>
            <table className="commonTable">
              <thead>
                <tr>
                  <th style={{ width: "120px" }}>소속</th>
                  <th style={{ width: "120px" }}>상호명</th>
                  <th style={{ width: "100px" }}>이름</th>
                  <th style={{ width: "146px" }}>휴대폰</th>
                </tr>
              </thead>

              <tbody>
                {prevUserList.map((item) => {
                  return (
                    <tr key={item.uid} onClick={(e) => fn(item)}>
                      <td style={{ width: "120px" }}>{item.afflname}</td>
                      <td style={{ width: "120px" }}>{item.cname}</td>
                      <td style={{ width: "100px" }}>{item.name}</td>
                      <td style={{ width: "146px" }}>{item.phonenum}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>
      </>
    )
  );
}
