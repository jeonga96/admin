import { useState } from "react";
import { useForm } from "react-hook-form";

import * as STR from "../../service/string";
import * as API from "../../service/api";
import * as UD from "../../service/useData";

export default function ServiceModalCompanySetRuidAdd({ click, setClick, fn }) {
  const { register, getValues } = useForm();
  const [list, setList] = useState([]);

  const fnSearch = (e) => {
    e.preventDefault();
    API.servicesPostData(STR.urlUserlist, {
      offset: 0,
      size: 15,
      uid: getValues("_uid"),
      userid: getValues("_userid"),
      name: getValues("_name"),
      mobile: getValues("_mobile"),
    }).then((res) => {
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
                <span>회원 관리번호</span>
              </label>
              <div>
                <input type="text" id="uid" {...register("_uid")} />
              </div>
            </div>
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
                <span>번호</span>
              </label>
              <div>
                <input type="text" id="mobile" {...register("_mobile")} />
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
                  <th style={{ width: "121px" }}>회원 관리번호</th>
                  <th style={{ width: "121px" }}>아이디</th>
                  <th style={{ width: "121px" }}>이름</th>
                  <th style={{ width: "121px" }}>핸드폰번호</th>
                </tr>
              </thead>

              <tbody style={{ height: "100px" }}>
                {list.map((item) => (
                  <tr key={item.uid} onClick={() => fn(item)}>
                    <td style={{ width: "121px" }}>{item.uid}</td>
                    <td style={{ width: "121px" }}>{item.userid}</td>
                    <td style={{ width: "121px" }}>{item.name}</td>
                    <td style={{ width: "121px" }}>{item.mobile}</td>
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
