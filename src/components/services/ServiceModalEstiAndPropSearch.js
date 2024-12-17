import { useState } from "react";
import { useForm } from "react-hook-form";

import * as APIURL from "../../service/string/apiUrl";
import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";

export default function ServiceModalEstiAndPropSearch({ click, setClick, fn }) {
  const { register, getValues, watch, reset } = useForm();

  const [list, setList] = useState([]);

  // 검색
  const fnSearch = (e) => {
    e.preventDefault();
    API.servicesPostData(APIURL.urlUserlist, {
      offset: 0,
      size: 100,
      isCid: getValues("_isCid"),
      mobile: getValues("_mobile"),
      name: getValues("_name"),
      userid: getValues("_userid"),
    }).then((res) => {
      console.log(":", res);
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
                <span>아이디</span>
              </label>
              <div>
                <input type="text" id="userid" {...register("_userid")} />
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
                <span>연락처 번호</span>
              </label>
              <div>
                <input
                  type="text"
                  id="mobile"
                  {...register("_mobile")}
                  maxLength={13}
                  value={
                    (watch("_mobile") &&
                      watch("_mobile")
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
            <div className="listSearchWrap" style={{ width: "50%" }}>
              <label className="blockLabel">
                <span>회원정보</span>
              </label>
              <div>
                <input
                  className="listSearchRadioInput"
                  type="radio"
                  id="isCid0"
                  value="0"
                  {...register("_isCid")}
                />
                <label className="listSearchRadioLabel" htmlFor="isCid0">
                  일반
                </label>
                <input
                  className="listSearchRadioInput"
                  type="radio"
                  id="isCid1"
                  value="1"
                  {...register("_isCid")}
                />
                <label className="listSearchRadioLabel" htmlFor="isCid1">
                  사업자
                </label>
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
                  <th style={{ width: "121px" }}>아이디</th>
                  <th style={{ width: "121px" }}>이름</th>
                  <th style={{ width: "242px" }}>번호</th>
                </tr>
              </thead>

              <tbody style={{ height: "300px" }}>
                {list.map((item) => (
                  <tr
                    key={item.uid}
                    onClick={() => {
                      fn(item);
                      setTimeout(() => {
                        reset();
                      }, 1000);
                    }}
                  >
                    <td style={{ width: "121px" }}>{item.userid}</td>
                    <td style={{ width: "121px" }}>{item.name}</td>
                    <td style={{ width: "242px" }}>{item.mobile}</td>
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
