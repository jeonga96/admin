import { useState } from "react";
import { IoMdRemoveCircleOutline } from "react-icons/io";

export default function ImageOnEvent({ onRemove, getData, url, iid, text }) {
  const [zoomPopup, setZoomPopup] = useState(false);
  const onPopup = () => {
    setZoomPopup(!zoomPopup);
  };

  return (
    <div
      style={
        getData && {
          backgroundImage: `url("${url}")`,
        }
      }
    >
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
