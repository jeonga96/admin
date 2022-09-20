import { BiUpload } from "react-icons/bi";
import {
  servicesPostDataForm,
  servicesPostData,
} from "../../Services/importData";
import { useDidMountEffect } from "../../Services/customHook";
import { urlUpImages, urlGetImages } from "../../Services/string";

export default function SetImage({
  img,
  setImg,
  getData,
  imgsIid,
  id,
  title,
  getDataFinish,
}) {
  useDidMountEffect(() => {
    if (!!getData.titleImg) {
      servicesPostData(urlGetImages, {
        imgs: getData.titleImg,
      }).then((res) => {
        setImg(res.data);
      });
    }
    if (getData.imgs) {
      servicesPostData(urlGetImages, {
        imgs: getData.imgs,
      }).then((res) => {
        setImg(res.data);
        console.log("imgs", res.data);
      });
    }
  }, [getDataFinish]);

  function setImage(img) {
    return setImg(img);
  }

  function handleSetImage(event) {
    event.preventDefault();
    const files = event.target.files;
    const formData = new FormData();
    if (event.target.id === "titleImg") {
      console.log("titleUpload click-->", files[0]);
      formData.append("Imgs", files[0]);
    } else {
      for (let i = 0; i < files.length; i++) {
        console.log(i, "titleUpload click-->", files[i]);
        formData.append("Imgs", files[i]);
      }
    }

    servicesPostDataForm(urlUpImages, formData).then((res) => {
      setImage(res.data);
      if (res.data.length > 1) {
        for (let i = 0; i < res.data.length; i++) {
          // imgsIid.current.push(res.data[i].iid);
          console.log(imgsIid);
        }
      }
    });
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
          multiple={imgsIid ? "multiple" : null}
        />
      </div>
      <div className="imgsThumbnail">
        {imgsIid && !img ? (
          <span>이미지를 두개 이상 업로드해주세요.</span>
        ) : null}
        {(img && img.length === 1) || (img && !imgsIid) ? (
          <div
            style={{
              backgroundImage: `url("${img[0].storagePath}")`,
            }}
          >
            <span className="blind">사업자 대표 이미지</span>
          </div>
        ) : (
          img &&
          img.map((item, key) => (
            <div
              key={key}
              style={{
                backgroundImage: `url("${item.storagePath}")`,
              }}
            >
              <span className="blind">사업자 상세 정보 이미지</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
