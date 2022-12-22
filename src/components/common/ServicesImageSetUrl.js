import {
  servicesPostDataForm,
  servicesPostData,
} from "../../Services/importData";
import { useDidMountEffect } from "../../Services/customHook";
import { urlUpImages, urlGetImages } from "../../Services/string";

export default function ImageSet({
  getData,
  id,
  getDataFinish,
  setChangeImg,
  changeImg,
}) {
  // 첫 렌더링을 방지하고, 기존 입력된 이미지가 있다면 서버에서 이미지를 가져온다.
  useDidMountEffect(() => {
    if (getData.titleImg) {
      servicesPostData(urlGetImages, {
        imgs: getData.titleImg,
      }).then((res) => {
        setChangeImg(res.data);
      });
    }
  }, [getDataFinish]);

  // 이미지 업로드 시 실행되는 코드
  function handleSetImage(event) {
    event.preventDefault();
    const files = event.target.files;
    const formData = new FormData();
    formData.append("Imgs", files[0]);

    // FormData에 저장된 데이터를 서버에 보냄
    servicesPostDataForm(urlUpImages, formData).then((res) => {
      return setChangeImg(res.data);
    });
  }

  return (
    <div className="basicInputWrap">
      <label htmlFor={id} className="blind" style={{ width: "20px" }} />
      {/* change 이벤트가 발생하였거나, 기존에 입력된 값이 있는 경우 기본 인풋 태그가 표시된다. */}
      {changeImg === null ? (
        <input
          type="file"
          id={id}
          name={"__" + id}
          accept="image/*"
          onChange={handleSetImage}
        />
      ) : (
        <>
          <label htmlFor={id} className="basicModifyBtn">
            변경
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
