import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  servicesPostDataToken,
  servicesGetStorage,
} from "../Services/importData";
import { urlUserlist, ISLOGIN } from "../Services/string";

import PageButton from "../components/common/PageButton";

function User() {
  const [userList, setUserList] = useState([]);
  const [listPage, setListPage] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = servicesGetStorage(ISLOGIN);
    servicesPostDataToken(
      urlUserlist,
      {
        offset: page,
        size: 10,
      },
      token
    ).then((res) => {
      setUserList(res.data);
      setListPage(res.page);
    });
  }, [page]);

  return (
    <div className="mainWrap">
      <div className="tableTopWrap">
        <div className="smallButton">
          <Link className="smallButtonLink Link" to="/adduser">
            통합회원 추가
          </Link>
        </div>
      </div>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
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
          <PageButton listPage={listPage} page={page} setPage={setPage} />
        </div>
      </section>
    </div>
  );
}
export default User;
