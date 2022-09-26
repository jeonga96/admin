import { useState } from "react";

export default function ImageOnEvent({ getData, url, text }) {
  const [zoomPopup, setZoomPopup] = useState(false);
  const onPopup = () => {
    setZoomPopup(!zoomPopup);
  };
  const onRemove = () => {
    console.log("삭제하자아아");
  };

  return (
    <div
      style={
        getData && {
          backgroundImage: `url("${url}")`,
        }
      }
    >
      <button type="button" className="imgRemoveBtn" onClick={onRemove}>
        X
      </button>
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
