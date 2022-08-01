import { Link } from "react-router-dom";
function Company() {
  return (
    <div className="mainWrap">
      <div className="addButton">
        <Link className="addButtonLink" to="/company/addcompany">
          사업자 추가
        </Link>
      </div>
    </div>
  );
}
export default Company;
