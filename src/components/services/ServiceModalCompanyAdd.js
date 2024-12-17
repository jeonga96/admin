import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import * as APIURL from "../../service/string/apiUrl";
import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as CLICK from "../../action/click";

export default function ServiceModalCompanyAdd({ fn }) {
  const { register, getValues, watch } = useForm();
  const dispatch = useDispatch();
  const clickModal = useSelector(
    (state) => state.click.modalClick,
    shallowEqual
  );
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (clickModal) {
      API.servicesPostData(APIURL.urlUserlist, {
        offset: 0,
        size: 30,
        uid: "",
        cdnamd: "",
        telnum: "",
        name: "",
      }).then((res) => {
        console.log(res);
        if (res.status === "fail") {
          TOA.servicesUseToast("검색하신 데이터가 없습니다.", "e");
        }
        if (res.status === "success") {
          setUserList(res.data);
        }
      });
    }
  }, [clickModal]);

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
    if (getValues("_cdnamd")) {
      requestData.cdnamd = getValues("_cdnamd");
    }
    if (getValues("_telnum")) {
      requestData.telnum = getValues("_telnum");
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
        setUserList(res.data);
      }
    });
  };

  return (
    clickModal && (
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
            <button
              type="reset"
              value="초기화"
              onClick={() => dispatch(CLICK.serviceModalClick(!clickModal))}
            >
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
                  <th style={{ width: "100px" }}>회원 관리번호</th>
                  <th style={{ width: "120px" }}>아이디</th>
                  <th style={{ width: "110px" }}>이름</th>
                  <th style={{ width: "135px" }}>번호</th>
                </tr>
              </thead>

              <tbody style={{ height: "216px" }}>
                {userList
                  .filter((item) => !item.cid)
                  .map((item) => (
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
            <span
              style={{
                display: "block",
                marginTop: "20px",
                textAlign: "center",
                color: "#454545",
              }}
            >
              사업자가 연결되어 있는 회원번호는 표시되지 않습니다.
            </span>
          </section>
        </div>
      </>
    )
    // <>
    //   <div className="clickModal">
    //     <section className="tableWrap">
    //       <h3 className="blind">회원관리 리스트</h3>
    //       <table className="commonTable">
    //         <thead>
    //           <tr>
    //             <th style={{ width: "80px" }}>관리번호</th>
    //             <th style={{ width: "100px" }}>사업자 연결</th>
    //             <th style={{ width: "100px" }}>아이디</th>
    //             <th style={{ width: "100px" }}>이름</th>
    //             <th style={{ width: "auto" }}>휴대폰</th>
    //           </tr>
    //         </thead>

    //         <tbody style={{ display: "table" }}>
    //           {userList &&
    //             userList.map((item) => (
    //               <tr key={item.uid} onClick={() => fn(item)}>
    //                 <td style={{ width: "80px" }}>{item.uid}</td>
    //                 <td style={{ width: "100px" }}>{item.cid ? "O" : "X"}</td>
    //                 <td style={{ width: "100px", whiteSpace: "normal" }}>
    //                   {item.userid}
    //                 </td>
    //                 <td style={{ width: "100px" }}>{item.name}</td>
    //                 <td style={{ width: "auto" }}>{item.mobile}</td>
    //                 {/* <td style={{ width: "auto" }}>
    //                   {item.createTime && item.createTime.slice(0, 10)}
    //                 </td> */}
    //               </tr>
    //             ))}
    //         </tbody>
    //       </table>
    //     </section>
    //     <button
    //       type="button"
    //       onClick={() => dispatch(CLICK.serviceClick(!clickModal))}
    //       className="formContentBtn"
    //     >
    //       검색
    //     </button>
    //   </div>
    // </>
  );
}
