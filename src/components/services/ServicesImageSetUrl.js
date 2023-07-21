// -- 사용예시 : SetAdminAppbanner --

import * as API from "../../Services/api";
import * as STR from "../../Services/string";

export default function ImageSet({
  add,
  id,
  setChangeImg,
  changeImg,
  onImgChange,
}) {
  // 이미지 업로드 시 실행되는 코드

  function handleSetImage(e) {
    e.preventDefault();
    const files = e.target.files;
    const formData = new FormData();
    formData.append("Imgs", files[0]);

    // FormData에 저장된 데이터를 서버에 보냄
    API.servicesPostDataForm(STR.urlUpImages, formData).then((res) => {
      setChangeImg(res.data);
      onImgChange(e, res.data);
    });
  }

  return (
    <div className="basicInputWrap">
      <label htmlFor={id} className="blind" style={{ width: "20px" }} />
      {/* change 이벤트가 발생하였거나, 기존에 입력된 값이 있는 경우 기본 인풋 태그가 표시된다. */}
      {changeImg === null ? (
        <>
          <label htmlFor={id} className="basicModifyBtn">
            {add ? "이미지 등록" : "이미지 수정"}
          </label>
          <input
            type="file"
            id={id}
            name={"__" + id}
            accept="image/*"
            onChange={handleSetImage}
            className="blind"
            style={{ width: "1px", height: "1px" }}
          />
        </>
      ) : (
        <>
          <label htmlFor={id} className="basicModifyBtn">
            이미지 재수정
          </label>
          <input
            type="file"
            id={id}
            name={"__" + id}
            accept="image/*"
            onChange={handleSetImage}
            className="blind"
            style={{ width: "1px", height: "1px" }}
          />
        </>
      )}
    </div>
  );
}
