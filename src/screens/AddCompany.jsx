import { useSelector, useDispatch } from "react-redux";

function AddCompany() {
  const company = useSelector((state) => state.companyAdd);
  const dispatch = useDispatch();

  function onChange(e) {
    dispatch({
      type: "companyInfoAddInputChange",
      payload: { name: [e.target.value] },
    });
  }
  const fnAdd = (e) => {
    e.preventDefault();
    if (company.name === "") {
      return alert("추가하실 업체명을 입력해 주세요.");
    }
    dispatch({
      type: "addCompanyEvent",
    });
  };
  return (
    <section className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <h3>사업자 추가</h3>
        <form className="formLayout" onSubmit={fnAdd}>
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
            사업체 추가하기
          </button>
        </form>
      </div>
    </section>
  );
}

export default AddCompany;
