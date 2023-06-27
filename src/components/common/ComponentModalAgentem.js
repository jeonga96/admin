import { useDispatch, useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { servicesPostData } from "../../Services/importData";
import { urlUserlist, urlGetCompanyDetail } from "../../Services/string";

export default function ComponentModalAgentem({ fn }) {
  const dispatch = useDispatch();
  const clickModal = useSelector((state) => state.click, shallowEqual);
  const [prevUserList, setPrevUserList] = useState([]);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    servicesPostData(urlUserlist, {
      offset: 0,
      userrole: "ROLE_ADMIN_SD",
      size: 30,
    }).then((res) => {
      setPrevUserList(res.data);
    });
  }, []);

  useEffect(() => {
    const newArr = [];
    prevUserList.forEach((item) => {
      return servicesPostData(urlGetCompanyDetail, {
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
  }, [clickModal && prevUserList]);

  return (
    clickModal && (
      <>
        <div className="clickModal">
          <section className="tableWrap">
            <h3 className="blind">table</h3>
            <div className="paddingBox commonBox">
              <table className="commonTable">
                <thead>
                  <tr>
                    <th style={{ width: "100px" }}>관리번호</th>
                    <th style={{ width: "100px" }}>대표자</th>
                    <th style={{ width: "100px" }}>사업장명</th>
                    <th style={{ width: "150px" }}>핸드폰번호</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((item) => {
                    return (
                      <tr key={item.uid} onClick={(e) => fn(e)}>
                        <td>{item.uid}</td>
                        <td>{item.name}</td>
                        <td>
                          {item.additionalData && item.additionalData.name}
                        </td>
                        <td>{item.mobile}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: "clickEvent",
                  payload: !clickModal,
                })
              }
              className="formContentBtn"
            >
              검색
            </button>
          </section>
        </div>
        <div></div>
      </>
    )
  );
}
