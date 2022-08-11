import { useState } from "react";
import { axiosPostToken, getStorage } from "../Services/importData";
import { urlAddcompany, ISLOGIN } from "../Services/string";

function AddCompany() {
  const [CompanyData, setCompanyData] = useState({
    name: "",
  });

  function onChange(e) {
    setCompanyData({ [e.target.id]: [e.target.value] });
  }

  function addCompanyEvent() {
    const token = getStorage(ISLOGIN);
    axiosPostToken(
      urlAddcompany,
      {
        name: CompanyData.name[0],
      },
      token
    )
      .then((res) => {
        console.log("axios는 성공했는데 말이죠", res);
        if (res.status === "fail") {
          alert("잘못된 값을 입력했습니다.");
          return;
        }
        if (res.status === "success") {
          alert("가입이 완료되었습니다!");
          window.location.href = "/company";
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
        <form className="formLayout" onSubmit={AddCompanySubmit}>
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
          <button type="submit" className="loginBtn">
            사업자 추가하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCompany;
