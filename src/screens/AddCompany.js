import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { servicesPostData } from "../Services/importData";
import { servicesUseToast } from "../Services/useData";
import { urlAddcompany } from "../Services/string";
import LayoutTopButton from "../components/common/LayoutTopButton";

export default function AddCompany() {
  // react-hook-form 라이브러리
  const {
    handleSubmit,
    register,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm();
  const navigate = useNavigate();

  // 사업자 회원 추가 이벤트
  const handleSumbit = (e) => {
    servicesPostData(urlAddcompany, {
      name: getValues("_name"),
    })
      .then((res) => {
        if (res.status === "fail") {
          servicesUseToast("잘못된 값을 입력했습니다.", "e");
          return;
        }
        // 정상 등록 완료
        // 디테일 정보를 입력하도록 사업자 상세정보로 이동
        if (res.status === "success") {
          servicesUseToast("가입이 완료되었습니다!", "s");
          navigate(`/company/${res.data.cid}`);
          return;
        }
      })
      .catch((error) => console.log("실패", error.response));
  };

  return (
    <>
      <div className="commonBox">
        <form
          className="formLayout formCenterLayout"
          onSubmit={handleSubmit(handleSumbit)}
        >
          <ul className="tableTopWrap">
            <LayoutTopButton text="완료" disabled={isSubmitting} />
          </ul>
          <div className="formContentWrap">
            <label htmlFor="name" className="blockLabel">
              <span>계약자명</span>
            </label>
            <div>
              <input
                type="text"
                id="name"
                placeholder="계약자명을 입력해 주세요."
                {...register("_name", {
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
              <ErrorMessage
                errors={errors}
                name="name"
                render={({ message }) => (
                  <span className="errorMessageWrap">{message}</span>
                )}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
