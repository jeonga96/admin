import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { axiosPostToken, getStorage } from "../Services/importData";
import { urlUserlist, ISLOGIN } from "../Services/string";
function User() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const Token = getStorage(ISLOGIN);
    axiosPostToken(
      urlUserlist,
      {
        offset: 0,
        size: 10,
      },
      Token
    ).then((res) => {
      setData(res.data);
      console.log(data, "dlrddd", res.data);
    });
  }, []);
  return (
    <div className="mainWrap">
      <div className="tableTopWrap">
        <div className="addButton">
          <Link className="addButtonLink" to="/user/adduser">
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
                <th>userrole</th>
                <th>createTime</th>
                <th>updateTime</th>
              </tr>
            </thead>
            <tbody className="revenueSaleTbody">
              {/* {filterData.map((item) => (
                <Tr key={item.id} item={item} />
              ))} */}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
export default User;
