import { Link } from "react-router-dom";
function Company() {
  return (
    <div className="mainWrap">
      <div className="tableTopWrap">
        <div className="addButton">
          <Link className="addButtonLink Link" to="/company/addcompany">
            사업자 추가
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
              {/* {listUser.map((item) => (
                <tr key={item.uid}>
                  <td>{item.uid}</td>
                  <td>{item.userid}</td>
                  <td>{item.createTime}</td>
                </tr>
              ))} */}
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
export default Company;
