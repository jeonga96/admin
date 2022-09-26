import { useState } from "react";

export default function ImageOnEvent({ getData, url, text }) {
  const [zoomPopup, setZoomPopup] = useState(false);
  const onPopup = () => {
    setZoomPopup(!zoomPopup);
  };

  return (
    <div
      onClick={onPopup}
      style={
        getData && {
          backgroundImage: `url("${url}")`,
        }
      }
    >
      <span className="blind">{text}</span>
      {zoomPopup ? (
        <div className="imageZoomPopupBox">
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
