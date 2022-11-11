import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData } from "../Services/importData";
import { urlAddcompany } from "../Services/string";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function AddCompany() {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm();
  let navigate = useNavigate();
  const [CompanyData, setCompanyData] = useState({
    name: "",
  });

  function onChange(e) {
    setCompanyData({ [e.target.id]: [e.target.value] });
  }

  const AddCompanySubmit = (e) => {
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
          navigate(`/company/${res.data.cid}`, {
            replace: true,
          });
          return;
        }
      })
      .catch((error) => console.log("실패", error.response));
  };

  return (
    <>
      <div className="commonBox">
        <form className="formLayout" onSubmit={handleSubmit(AddCompanySubmit)}>
          <ul className="tableTopWrap">
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>
          <div className="formContentWrap">
            <label htmlFor="name" className="blockLabel">
              계약자명
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="계약자명을 입력해 주세요."
              onChange={onChange}
              {...register("name", {
                onChange: onChange,
                required: "계약자명은 필수로 입력해야 합니다.",
                minLength: {
                  value: 2,
                  message: "2자 이상의 이름만 사용가능합니다.",
                },
                maxLength: {
                  value: 8,
                  message: "8자 이하의 이름만 사용가능합니다.",
                },
                pattern: {
                  value: /[ㄱ-ㅎ가-힣]/,
                  message: "입력 형식에 맞지 않습니다.",
                },
              })}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => (
              <span className="errorMessageWrap">{message}</span>
            )}
          />
        </form>
      </div>
    </>
  );
}
