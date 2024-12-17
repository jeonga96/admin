import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";

import * as CLICK from "../../action/click";

export default function ServiceModalAgentem({ fn }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const clickModal = useSelector((state) => state.click.click, shallowEqual);

  const [prevUserList, setPrevUserList] = useState([]);
  const [userList, setUserList] = useState([]);

  const CK_AGENT_AG = location.pathname.includes("agentag");

  useEffect(() => {
    let managetype;

    if (CK_AGENT_AG) {
      managetype = "SD";
    } else {
      managetype = "AG,SD";
    }

    API.servicesPostData(APIURL.urlListDistribution, {
      offset: 0,
      size: 150,
      managetype: managetype,
    }).then((res) => {
      if (res.status === "success") {
        setPrevUserList(res.data);
        console.log("eee :", res.data);
      }
    });
  }, []);

  const memoizedPrevUserList = useMemo(() => prevUserList, [prevUserList]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      const newArr = [];

      for (const item of memoizedPrevUserList) {
        try {
          const response = await API.servicesPostData(
            APIURL.urlListDistribution,
            {
              offset: 0,
              size: 20,
            }
          );
          const result = response.data;

          memoizedPrevUserList.forEach((user) => {
            if (user.daid === item.daid) {
              newArr.push({ ...user, additionalData: result });
            }
          });
        } catch (error) {
          console.error(error);
        }
      }

      if (newArr.length === memoizedPrevUserList.length) {
        const uidSortArr = newArr.sort((a, b) => b.daid - a.daid);
        setUserList(uidSortArr);
        // setFinish(true);
      }
    };

    if (memoizedPrevUserList.length > 0) {
      fetchAdditionalData();
    }
  }, [memoizedPrevUserList]);

  return (
    clickModal && (
      <>
        <div className="clickModal">
          <section className="tableWrap" style={{ height: "380px" }}>
            <h3 className="blind">table</h3>
            <table className="commonTable">
              <thead>
                <tr>
                  <th style={{ width: "240px" }}>소속</th>
                  {/* {CK_AGENT_EM && <th style={{ width: "110px" }}>소속</th>} */}
                  <th style={{ width: "90px" }}>대표자</th>
                  {/* <th
                    style={
                      CK_AGENT_EM ? { width: "130px" } : { width: "240px" }
                    }
                  >
                    사업장명
                  </th> */}

                  <th style={{ width: "157px" }}>휴대폰</th>
                </tr>
              </thead>

              <tbody>
                {userList.map((item) => {
                  return (
                    <tr key={item.daid} onClick={() => fn(item)}>
                      <td style={{ width: "240px" }}>
                        {item.managetype === "SD"
                          ? `${item.cname}`
                          : item.managetype === "AG"
                          ? `${
                              item.afflname === "[ 본사 ] 와짱 ( 주 )"
                                ? item.afflname
                                : `${item.afflname}`
                            }  /  ${item.cname}`
                          : item.afflname}
                      </td>
                      {/* {CK_AGENT_EM && (
                        <td style={{ width: "110px" }}>{item.afflname}</td>
                      )} */}
                      <td style={{ width: "90px" }}>{item.name}</td>
                      {/* <td
                        style={
                          CK_AGENT_EM ? { width: "130px" } : { width: "240px" }
                        }
                      >{`[ ${item.managetype === "SD" ? "총판" : "대리점"} ] ${
                        item.cname
                      }`}</td> */}
                      <td style={{ width: "157px" }}>{item.phonenum}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <button
            type="button"
            className="formContentBtn"
            onClick={() => dispatch(CLICK.serviceClick(false))}
          >
            닫기
          </button>
        </div>
      </>
    )
  );
}
