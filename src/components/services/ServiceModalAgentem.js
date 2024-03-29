import { useState, useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import * as API from "../../service/api";
import * as STR from "../../service/string";

export default function ServiceModalAgentem({ fn }) {
  const dispatch = useDispatch();
  const clickModal = useSelector((state) => state.click, shallowEqual);

  const [prevUserList, setPrevUserList] = useState([]);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    API.servicesPostData(STR.urlUserlist, {
      offset: 0,
      userrole: "ROLE_ADMIN_SD",
      size: 30,
    }).then((res) => {
      if (res.status === "succees") {
        setPrevUserList(res.data);
      }
    });
  }, []);

  useEffect(() => {
    const newArr = [];
    console.log("prevUserList", prevUserList);
    !!prevUserList &&
      prevUserList.forEach((item) => {
        return API.servicesPostData(STR.urlGetCompanyDetail, {
          rcid: item.cid,
        })
          .then((response) => response.data)
          .then((result) => {
            prevUserList.map((user) => {
              if (user.cid === item.cid) {
                return newArr.push({ ...user, additionalData: result });
              }
              return user;
            });
            if (newArr.length === prevUserList.length) {
              const uidSortArr = newArr.sort((a, b) => b.uid - a.uid);
              setUserList(uidSortArr);
              // setFinish(true);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
  }, [prevUserList]);

  return (
    clickModal && (
      <>
        <div className="clickModal">
          <section className="tableWrap">
            <h3 className="blind">table</h3>
            <table className="commonTable">
              <thead>
                <tr>
                  <th style={{ width: "80px" }}>관리번호</th>
                  <th style={{ width: "100px" }}>대표자</th>
                  <th style={{ width: "150px" }}>사업장명</th>
                  <th style={{ width: "160px" }}>핸드폰번호</th>
                </tr>
              </thead>

              <tbody>
                {userList.map((item) => {
                  return (
                    <tr key={item.uid} onClick={(e) => fn(item)}>
                      <td style={{ width: "80px" }}>{item.uid}</td>
                      <td style={{ width: "100px" }}>{item.name}</td>
                      <td style={{ width: "150px" }}>
                        {item.additionalData && item.additionalData.name}
                      </td>
                      <td style={{ width: "160px" }}>{item.mobile}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <button
            type="button"
            className="formContentBtn"
            onClick={() =>
              dispatch({
                type: "serviceClick",
                payload: false,
              })
            }
          >
            닫기
          </button>
        </div>
      </>
    )
  );
}
