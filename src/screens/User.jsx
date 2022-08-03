import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosPostToken, getStorage } from "../Services/importData";
import { urlUserlist, ISLOGIN } from "../Services/string";

function User() {
  const [userList, setUserList] = useState([]);
  const [listPage, setListPage] = useState({});

  const buttonArr = [];
  const buttonIf =
    listPage.totalElements % 10 === 0
      ? listPage.totalPages
      : listPage.totalPages + 1;
  const buttonData = (index) => {
    let i = 1;
    for (i; i <= index; i++) {
      buttonArr.push(i);
    }
  };
  buttonData(buttonIf);

  useEffect(() => {
    const token = getStorage(ISLOGIN);
    axiosPostToken(
      urlUserlist,
      {
        offset: 1,
        size: 10,
      },
      token
    ).then((res) => {
      setUserList(res.data);
      setListPage(res.page);
    });
  }, []);

  return (
    <div className="mainWrap">
      <div className="tableTopWrap">
        <div className="addButton">
          <Link className="addButtonLink Link" to="/user/adduser">
            관리자 추가
          </Link>
        </div>
      </div>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="tableBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th>uid</th>
                <th>userid</th>
                <th>createTime</th>
              </tr>
            </thead>
            <tbody className="revenueSaleTbody">
              {userList.map((item) => (
                <tr key={item.uid}>
                  <td>{item.uid}</td>
                  <td>{item.userid}</td>
                  <td>{item.createTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="tableBtn">
            {buttonArr.map((item, key) => (
              <li key={key}>
                <button type="button">{item}</button>
                <span className="blind">{item}페이지로 가기</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
export default User;
