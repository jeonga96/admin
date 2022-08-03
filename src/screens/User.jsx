import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

function User() {
  // const listUser = useSelector((state) => state.listUser);
  const listUser = useSelector((state) => state.listUser);
  const listUserPage = useSelector((state) => state.listUserPage);
  const dispatch = useDispatch();

  // const buttonArr = [];
  // const buttonIf = totalLeng % 10 === 0 ? totalLeng / 10 : totalLeng / 10 + 1;
  // const buttonData = (index) => {
  //   let i = 1;
  //   for (i; i <= index; i++) {
  //     buttonArr.push(i);
  //   }
  // };
  // buttonData(buttonIf);

  useEffect(() => {
    dispatch({
      type: "listUserEvent",
    });
    console.log("useEffect", listUser, listUserPage);
  }, [listUser, listUserPage]);

  setTimeout(() => {
    console.log("setTimeout", listUser, listUserPage);
  }, 500);

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
              {listUser.map((item) => (
                <tr key={item.uid}>
                  <td>{item.uid}</td>
                  <td>{item.userid}</td>
                  <td>{item.createTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul>
            {/* {buttonArr.map((item, key) => (
              <li key={key}>
                <button type="button">{item}</button>
                <span className="blind">{item}페이지로 가기</span>
              </li>
            ))} */}
          </ul>
        </div>
      </section>
    </div>
  );
}
export default User;
