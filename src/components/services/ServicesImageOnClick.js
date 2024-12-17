// -- 시용예시 : ServicesImageSetPreview --

import { useState } from "react";
import { IoIosHeart, IoMdRemoveCircleOutline } from "react-icons/io";

export default function ImageOnClick({
  url,
  text,
  iid,
  onRemove,
  disabled,
  onSelect,
  titleImg,
  titleImgAbj,
}) {
  const [zoomPopup, setZoomPopup] = useState(false);
  const [errorNumber, setErrorNumber] = useState(1);

  const onPopup = () => {
    setZoomPopup(!zoomPopup);
  };

  const isValidImageUrl = (url) => {
    return typeof url === "object" && url.storagePath;
  };

  if (!isValidImageUrl(url)) {
    return null;
  }

  // const handleRemove = (iid) => {
  //   // 대표 이미지인지 확인
  //   if (titleImg) {
  //     // 대표 이미지 해제 로직 실행
  //     // 여기서 onRemove 함수를 호출하고, localStorage를 업데이트
  //     onRemove(iid);
  //     localStorage.setItem("isTitleImageSet", "false");
  //   } else {
  //     // 대표 이미지가 아니면 단순히 onRemove만 호출
  //     onRemove(iid);
  //   }
  // };

  // 대표 이미지 여부에 따라 클래스 이름 조건부 할당
  const imageClass = titleImg ? "image titleImg" : "image normalImg";

  return (
    <div className={titleImg ? " titleImgContainer" : "normalImgContainer"}>
      {iid && !disabled && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onRemove(iid);
            }}
          >
            <IoMdRemoveCircleOutline />
          </button>
          {onSelect && (
            <button
              type="button"
              className="imgHeartBtn"
              onClick={(e) => {
                e.preventDefault();
                onSelect(iid);
              }}
            >
              <IoIosHeart className={titleImg ? " titleImgHeart" : ""} />
            </button>
          )}
        </>
      )}

      <img
        alt={text}
        // src={url?.storagePath}
        src={url?.storagePath.replace("com/", "com/s/")}
        onError={(e) => {
          //  서버 이미지 오류 시 onError 이벤트를 반복적으로 동작시키는 것을 방지하기 위한 코드
          if (errorNumber === 1) {
            e.target.src = url.storagePath;
            setErrorNumber((res) => res + 1);
          } else {
            e.target.src = "./data/errorimage.png";
          }
          return;
        }}
        onClick={onPopup}
        className={imageClass}
        style={titleImgAbj ? { height: "63px" } : undefined}
      />
      <span className="blind">{text}</span>
      {zoomPopup && (
        <div
          className="imageZoomPopupBox"
          onClick={onPopup}
          style={{ height: "100%" }}
        >
          <img className="imageZoom" alt={text} src={url?.storagePath} />
        </div>
      )}
    </div>
  );
}
