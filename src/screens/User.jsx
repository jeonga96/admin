import { Link } from "react-router-dom";
function User() {
  return (
    <div className="mainWrap">
      <div className="addButton">
        <Link className="addButtonLink" to="/user/adduser">
          관리자 추가
        </Link>
      </div>
    </div>
  );
}
export default User;
