import { BiUpload } from "react-icons/bi";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import {
  servicesPostDataForm,
  servicesPostData,
} from "../../Services/importData";
import { useDidMountEffect } from "../../Services/customHook";
import { urlUpImages, urlGetImages } from "../../Services/string";
import ImageOnClick from "./ImageOnClick";

export default function SetImage({
  img,
  setImg,
  getData,
  imgs,
  setImgs,
  id,
  title,
  getDataFinish,
}) {
  const fnSetImg = (res) => {
    setImg && setImg(res);
  };
  const fnSetImgs = (res) => {
    setImgs && setImgs(res);
  };

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
        console.log(i, "titleUpload click-->", files[i]);
      }
    }

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

  function onRemove(iid) {
    if (id === "titleImg") {
      const newDiaryList = img.filter((it) => it.iid !== iid);
      fnSetImg(newDiaryList);
    } else {
      const newDiaryList = imgs.filter((it) => it.iid !== iid);
      fnSetImgs(newDiaryList);
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
        {imgs === null ? <span>이미지를 두개 이상 업로드해주세요.</span> : null}
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
