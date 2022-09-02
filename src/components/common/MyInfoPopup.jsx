import { useNavigate, Link } from "react-router-dom";
import { servicesRemoveStorage } from "../../Services/importData";
import { TOKEN } from "../../Services/string";

export default function MyInfoPopup() {
  const navigate = useNavigate();

  const logoutEvent = () => {
    servicesRemoveStorage(TOKEN);
    navigate("/login");
  };
  return (
    <div className="myinfopopupBox">
      <Link className="Link" to="/usermyinfo">
        회원 정보 보기
      </Link>
      <Link className="Link" to="/companymydetail">
        우리 회사 정보 확인
      </Link>
      <button className="Link" onClick={logoutEvent}>
        로그아웃
      </button>
    </div>
  );
}
