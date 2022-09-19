import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { servicesPostData } from "../Services/importData";
import { urlAddcompany } from "../Services/string";

export default function AddCompany() {
  let navigate = useNavigate();
  const [CompanyData, setCompanyData] = useState({
    name: "",
  });

  function onChange(e) {
    setCompanyData({ [e.target.id]: [e.target.value] });
  }

  function addCompanyEvent() {
    servicesPostData(urlAddcompany, {
      name: CompanyData.name[0],
    })
      .then((res) => {
        console.log("axios는 성공했는데 말이죠", res);
        if (res.status === "fail") {
          alert("잘못된 값을 입력했습니다.");
          return;
        }
        if (res.status === "success") {
          alert("가입이 완료되었습니다!");
          navigate(`/company/${res.data.cid}/setcompanydetail`, {
            replace: true,
          });
          return;
        }
      })
      .catch((error) => console.log("실패", error.response));
  }

  const AddCompanySubmit = (e) => {
    e.preventDefault();
    if (CompanyData.name === "") {
      return alert("추가하실 업체명을 입력해 주세요.");
    }
    addCompanyEvent();
  };

  return (
    <div className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <form className="inputFormLayout" onSubmit={AddCompanySubmit}>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="사업체명을 입력해 주세요."
            onChange={onChange}
          />
          <label htmlFor="name" className="blind userIdLabel">
            사업체명을 입력해 주세요.
          </label>
          <button type="submit" className="widthFullButton">
            작성 완료
          </button>
        </form>
      </div>
    </div>
  );
}
