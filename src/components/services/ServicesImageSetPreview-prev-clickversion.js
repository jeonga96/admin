// import { useRef, useState, useEffect } from "react";
import * as ID from "../../Services/importData";
import * as CH from "../../Services/customHook";
import * as STR from "../../Services/string";
import * as UD from "../../Services/useData";

import ServicesImageOnClick from "../piece/ServicesImageOnClick";
import Loading from "./Loading";

import { BiUpload } from "react-icons/bi";

export default function ImageSet({
  img,
  setImg,
  regImgs,
  setRegImgs,
  imgs,
  setImgs,
  id,
  title,
  getData,
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
  const fnSetRegImgs = (res) => {
    setRegImgs && setRegImgs(res);
  };

  // 첫 렌더링을 방지하고, 기존 입력된 이미지가 있다면 서버에서 이미지를 가져온다.
  CH.useDidMountEffect(() => {
    if (!!getData.titleImg) {
      ID.servicesPostData(STR.urlGetImages, {
        imgs: getData.titleImg,
      }).then((res) => {
        fnSetImg(res.data);
      });
    }

    if (!!getData.regImgs) {
      ID.servicesPostData(STR.urlGetImages, {
        imgs: getData.regImgs || getData.addImgs,
      }).then((res) => {
        fnSetRegImgs(res.data);
      });
    }

    if (getData.imgs || getData.imgString || getData.addImgs) {
      ID.servicesPostData(STR.urlGetImages, {
        imgs: getData.imgs || getData.imgString || getData.addImgs,
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
    if (event.target.id === "titleImg" || event.target.id === "regImgs") {
      formData.append("Imgs", files[0]);
    } else {
      for (let i = 0; i < files.length; i++) {
        formData.append("Imgs", files[i]);
      }
    }

    // FormData에 저장된 데이터를 서버에 보냄
    ID.servicesPostDataForm(STR.urlUpImages, formData).then((res) => {
      if (event.target.id === "titleImg") {
        // 회원, 사업자 관리 - 대표이미지 : titleImg ==============================
        fnSetImg(res.data);
      } else if (event.target.id === "regImgs") {
        // 사업자 관리, 사업자 이미지 : regImgs ==============================
        fnSetRegImgs(res.data);
      } else if (event.target.id === "addImgs") {
        // 견적서 관리 - 견적서 응답 참고 이미지 : addImgs ==============================
        fnSetImgs([...imgs]);
        if (imgs.length + res.data.length > 25) {
          return UD.servicesUseToast(
            "이미지는 최대 25개까지 입력하실 수 있습니다."
          );
        }
        for (let i = 0; i < res.data.length; i++) {
          setImgs((prev) => [res.data[i], ...prev]);
        }
      } else {
        // 회원, 사업자 관리 - 상세 이미지 : regImgs ==============================
        fnSetImgs([...imgs]);
        if (imgs.length + res.data.length > 25) {
          return UD.servicesUseToast(
            "상세 이미지는 최대 25개까지 입력하실 수 있습니다."
          );
        }
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
    } else if (id === "regImgs") {
      fnSetRegImgs(regImgs.filter((it) => it.iid !== iid));
    } else {
      fnSetImgs(imgs.filter((it) => it.iid !== iid));
    }
  }

  return (
    <div className="setImageWrap">
      <div>
        <div className="blockLabel">
          <span>{title}</span>
        </div>
        <label htmlFor={id} className="fileboxLabel">
          <BiUpload /> 사진 업로드
        </label>
        <input
          type="file"
          id={id}
          name={"__" + id}
          accept="image/*"
          className="blind"
          onChange={handleSetImage}
          multiple={id === "imgs" || "addImgs" ? "multiple" : null}
        />
      </div>

      <div className="imgsThumbnail">
        <Loading />
        {img !== null && img !== undefined && id === "titleImg" ? (
          <ServicesImageOnClick
            getData={img}
            url={img[0] && img[0].storagePath}
            text="사업자 대표 이미지"
            iid={img[0] && img[0].iid}
            onRemove={onRemove}
          />
        ) : null}
        {regImgs !== null && regImgs !== undefined && id === "regImgs" ? (
          <ServicesImageOnClick
            getData={regImgs}
            url={regImgs[0] && regImgs[0].storagePath}
            text="사업자 등록증 이미지"
            iid={regImgs[0] && regImgs[0].iid}
            onRemove={onRemove}
          />
        ) : null}
        {imgs !== null && imgs !== undefined && id === "addImgs"
          ? !!imgs &&
            imgs.map((item) => (
              <>
                <ServicesImageOnClick
                  key={item.iid}
                  getData={imgs}
                  url={!!item.storagePath && item.storagePath}
                  text="사업자 상세 정보 이미지"
                  iid={!!item.iid && item.iid}
                  onRemove={onRemove}
                />
              </>
            ))
          : null}
        {imgs !== null && imgs !== undefined && id === "imgs"
          ? !!imgs &&
            imgs.map((item) => (
              <ServicesImageOnClick
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
