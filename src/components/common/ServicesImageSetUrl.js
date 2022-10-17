import {
  servicesPostDataForm,
  servicesPostData,
} from "../../Services/importData";
import { useDidMountEffect } from "../../Services/customHook";
import { urlUpImages, urlGetImages } from "../../Services/string";

export default function ImageSet({ img, setImg, getData, id, getDataFinish }) {
  // 대표이미지와 상세이미지의 이미지를 모두 사용하기 위해 아래와 같이 작성

  const fnSetImg = (res) => {
    setImg(res);
  };

  // 첫 렌더링을 방지하고, 기존 입력된 이미지가 있다면 서버에서 이미지를 가져온다.
  useDidMountEffect(() => {
    if (getData.titleImg) {
      servicesPostData(urlGetImages, {
        imgs: getData.titleImg,
      }).then((res) => {
        fnSetImg(res.data);
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
      fnSetImg([...res.data, ...img]);
    });
  }

  return (
    <div className="basicInputWrap">
      <label htmlFor={id} className="blind" style={{ width: "20px" }} />
      <input
        type="file"
        id={id}
        name={"__" + id}
        accept="image/*"
        onChange={handleSetImage}
      />
    </div>
  );
}
