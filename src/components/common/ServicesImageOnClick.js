import { useState } from "react";
import { IoMdRemoveCircleOutline } from "react-icons/io";

export default function ImageOnClick({ onRemove, iid, getData, url, text }) {
  // { onRemove:삭제이벤트, iid:삭제하기 위해 사용하는 id값, getData:가져오는 image State value, url:image storagePath, text:이미지 설명 문구 }

  // image click 이벤트 상태 관리
  const [zoomPopup, setZoomPopup] = useState(false);
  const onPopup = () => {
    setZoomPopup(!zoomPopup);
    console.log(url);
  };
  return (
    <div
      style={
        getData && {
          backgroundImage: `url("${url}")`,
        }
      }
    >
      {/* 상위 컴포넌트에서 iid값을 전달하면 썸네일 이미지 호버 시 해당 버튼 요소가 표시된다 */}
      {iid && (
        <button
          type="button"
          className="imgRemoveBtn"
          onClick={() => {
            onRemove(iid);
          }}
        >
          <IoMdRemoveCircleOutline />
        </button>
      )}
      <div className="Link" onClick={onPopup} />
      <span className="blind">{text}</span>
      {zoomPopup ? (
        <div className="imageZoomPopupBox" onClick={onPopup}>
          <div
            className="imageZoom"
            style={{
              backgroundImage: `url("${url}")`,
            }}
          ></div>
        </div>
      ) : null}
    </div>
  );
}
