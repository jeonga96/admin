// -- 사용예시 : SetAdminAppbanner --

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

export default function ImageSet({
  id,
  setChangeImg,
  changeImg,
  chooseInputBox,
  setList,
}) {
  // 이미지 업로드 시 실행되는 코드

  function handleSetImage(e) {
    e.preventDefault();

    const files = e.target.files;
    if (files.size > 20000000) {
      return alert("20MB 용량 미만의 이미지만 등록 가능합니다.");
    }
    const formData = new FormData();
    formData.append("Imgs", files[0]);

    // FormData에 저장된 데이터를 서버에 보냄
    API.servicesPostDataForm(APIURL.urlUpImages, formData).then((res) => {
      if (res.status === "success") {
        const newImgArr = changeImg;
        newImgArr[chooseInputBox] = res.data[0];
        setChangeImg(newImgArr);

        setList((prev) => {
          const newPrev = [...prev];
          newPrev[chooseInputBox] = {
            ...newPrev[chooseInputBox],
            imgid: res.data[0].iid,
          };
          return newPrev;
        });
      } else {
        TOA.servicesUseToast("이미지가 업로드되지 않았습니다.", "e");
      }
    });
  }

  return (
    <div className="basicInputWrap">
      <label htmlFor={id} className="basicModifyBtn">
        이미지 수정
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
    </div>
  );
}
