import { BiUpload } from "react-icons/bi";
import {
  servicesPostDataForm,
  servicesPostData,
} from "../../Services/importData";
import { useDidMountEffect } from "../../Services/customHook";
import { urlUpImages, urlGetImages } from "../../Services/string";
import ImageOnClick from "./ImageOnClick";

export default function ImageSet({
  img,
  setImg,
  getData,
  imgs,
  setImgs,
  id,
  title,
  getDataFinish,
}) {
  // 대표이미지와 상세이미지의 이미지를 모두 사용하기 위해 아래와 같이 작성
  // 해당 이벤트는 event.target.id로 구분하고 있기 때문에 이 외에 실행 시 코드 수정 필요

  const fnSetImg = (res) => {
    setImg && setImg(res);
  };
  const fnSetImgs = (res) => {
    setImgs && setImgs(res);
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
    if (getData.imgs) {
      servicesPostData(urlGetImages, {
        imgs: getData.imgs,
      }).then((res) => {
        fnSetImgs(res.data);
      });
    }
  }, [getDataFinish]);

  // 이미지 업로드 시 실행되는 코드
  function handleSetImage(event) {
    event.preventDefault();
    const files = event.target.files;
    const formData = new FormData();
    if (event.target.id === "titleImg") {
      console.log("titleUpload click-->", files[0]);
      formData.append("Imgs", files[0]);
    } else {
      for (let i = 0; i < files.length; i++) {
        formData.append("Imgs", files[i]);
        console.log("imgsUpload click-->", files[i]);
      }
    }

    // FormData에 저장된 데이터를 서버에 보냄
    servicesPostDataForm(urlUpImages, formData).then((res) => {
      if (event.target.id === "titleImg") {
        fnSetImg(res.data);
      } else {
        fnSetImgs([...imgs]);
        for (let i = 0; i < res.data.length; i++) {
          fnSetImgs((prev) => [res.data[i], ...prev]);
        }
      }
    });
  }

  // 이미지 삭제 시 실행되는 코드
  function onRemove(iid) {
    if (id === "titleImg") {
      fnSetImg(img.filter((it) => it.iid !== iid));
    } else {
      fnSetImgs(imgs.filter((it) => it.iid !== iid));
    }
  }

  return (
    <div className="setImageWrap">
      <div className="imgsTitle">
        <div className="blockLabel">{title}</div>

        <label htmlFor={id} className="blockLabel fileboxLabel">
          <BiUpload /> 사진 업로드
        </label>
        <input
          type="file"
          id={id}
          name={"__" + id}
          accept="image/*"
          className="blind"
          onChange={handleSetImage}
          multiple={id === "imgs" ? "multiple" : null}
        />
      </div>
      <div className="imgsThumbnail">
        {img !== null && id === "titleImg" ? (
          <ImageOnClick
            getData={img}
            url={img[0] && img[0].storagePath}
            text="사업자 대표 이미지"
            iid={img[0] && img[0].iid}
            onRemove={onRemove}
          />
        ) : null}
        {imgs !== null && id === "imgs"
          ? !!imgs &&
            imgs.map((item) => (
              <ImageOnClick
                key={item.iid}
                getData={imgs}
                url={item.storagePath && item.storagePath}
                text="사업자 상세 정보 이미지"
                iid={item.iid && item.iid}
                onRemove={onRemove}
              />
            ))
          : null}
      </div>
    </div>
  );
}
