import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useRef, useState, useEffect, useCallback } from "react";

import * as API from "../../Services/api";
import * as CH from "../../Services/customHook";
import * as STR from "../../Services/string";
import * as UD from "../../Services/useData";

import ServicesImageOnClick from "./ServicesImageOnClick";
import Loading from "../piece/PieceLoading";

export default function ImageSet({ id, title }) {
  const dispatch = useDispatch();

  const getedData = useSelector((state) => state.getedData, shallowEqual);

  const img = useSelector((state) => state.imgData, shallowEqual);
  const imgs = useSelector((state) => state.imgsData, shallowEqual);
  const multiImgs = useSelector((state) => state.multiImgsData, shallowEqual);

  const [files, setFiles] = useState([]);
  const dragRef = useRef(null);
  let [loading, setLoading] = useState(false);

  const fnState = (files) => {
    if (id === "titleImg") {
      dispatch({
        type: "imgData",
        payload: files,
      });
    } else if (id === "imgs") {
      dispatch({
        type: "imgsData",
        payload: files,
      });
    } else if (id === "imgString" || id === "regImgs" || id === "addImgs") {
      dispatch({
        type: "multiImgsData",
        payload: files,
      });
    }
    return setLoading(false);
  };

  CH.useDidMountEffect(() => {
    if (!!getedData.titleImg && id === "titleImg") {
      API.servicesPostData(STR.urlGetImages, {
        imgs: getedData.titleImg,
      }).then((res) => {
        if (res.status === "success") {
          fnState(res.data);
          setFiles(res.data);
        }
      });
    } else if (!!getedData.imgs && id === "imgs") {
      API.servicesPostData(STR.urlGetImages, {
        imgs: getedData.imgs,
      }).then((res) => {
        if (res.status === "success") {
          fnState(res.data);
          setFiles(res.data);
        }
      });
    } else if (
      !!getedData.imgString ||
      !!getedData.regImgs ||
      !!getedData.addImgs
    ) {
      if (id === "imgString" || id === "regImgs" || id === "addImgs") {
        API.servicesPostData(STR.urlGetImages, {
          imgs: getedData.imgString || getedData.regImgs || getedData.addImgs,
        }).then((res) => {
          if (res.status === "success") {
            fnState(res.data);
            setFiles(res.data);
          }
        });
      }
    }
  }, [getedData]);

  const onChangeFiles = useCallback(
    (e) => {
      e.preventDefault();
      let selectFiles = [];
      if (e.type === "drop") {
        selectFiles = e.dataTransfer.files;
      } else {
        selectFiles = e.target.files;
      }
      const formData = new FormData();
      for (let i = 0; i < selectFiles.length; i++) {
        formData.append("Imgs", selectFiles[i]);
      }
      setLoading(true);
      API.servicesPostDataForm(STR.urlUpImages, formData).then((res) => {
        if (res.data.length == 1) {
          if (id === "titleImg") {
            setFiles(() => [res.data[0]]);
            fnState([res.data[0]]);
          } else {
            setFiles((prev) => [res.data[0], ...prev]);
            id === "imgs"
              ? fnState([...imgs, res.data[0]])
              : fnState([...multiImgs, res.data[0]]);
          }
        } else if (res.data.length > 1 && res.data.length < 25) {
          const arrData = [];
          for (let i = 0; i < res.data.length; i++) {
            setFiles((prev) => [res.data[i], ...prev]);
            arrData.push(res.data[i]);
          }
          fnState([...arrData, ...files]);
        } else {
          setLoading(false);
          return UD.servicesUseToast(
            "이미지는 최대 25개까지 입력하실 수 있습니다."
          );
        }
      });
    },
    [files]
  );

  // console.log(files);

  const handleFilterFile = useCallback(
    (iid) => {
      setFiles(files.filter((it) => it.iid !== iid));
      if (id === "titleImg") {
        dispatch({
          type: "imgData",
          payload: img.filter((it) => it.iid !== iid),
        });
      } else if (id === "imgs") {
        dispatch({
          type: "imgsData",
          payload: imgs.filter((it) => it.iid !== iid),
        });
      } else {
        dispatch({
          type: "multiImgsData",
          payload: multiImgs.filter((it) => it.iid !== iid),
        });
      }
    },
    [files]
  );

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    // setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files) {
      // setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      onChangeFiles(e);
      // setIsDragging(false);
    },
    [onChangeFiles]
  );

  const initDragEvents = useCallback(() => {
    // 앞서 말했던 4개의 이벤트에 Listener를 등록합니다. (마운트 될때)
    if (dragRef.current !== null) {
      dragRef.current.addEventListener("dragenter", handleDragIn);
      dragRef.current.addEventListener("dragleave", handleDragOut);
      dragRef.current.addEventListener("dragover", handleDragOver);
      dragRef.current.addEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback(() => {
    // 앞서 말했던 4개의 이벤트에 Listener를 삭제합니다. (언마운트 될때)
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener("dragenter", handleDragIn);
      dragRef.current.removeEventListener("dragleave", handleDragOut);
      dragRef.current.removeEventListener("dragover", handleDragOver);
      dragRef.current.removeEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();
    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  return (
    <div className="setImageWrap">
      <div>
        <div className="blockLabel">
          <span>{title}</span>
        </div>
        <label className="imgBtn" htmlFor={id} ref={dragRef}>
          이미지 추가
        </label>
      </div>

      <div className="imgsThumbnail">
        <Loading loading={loading} />
        <input
          type="file"
          id={id}
          style={{ display: "none" }}
          multiple={id === "titleImg" ? false : true}
          onChange={onChangeFiles}
        />

        <label
          htmlFor={id}
          ref={dragRef}
          style={
            id === "regImgs" && multiImgs.length > 0
              ? {
                  backgroundColor: "#bdbdbd",
                  height:
                    files.length <= 10
                      ? "94px"
                      : files.length <= 20
                      ? "186px"
                      : "288px",
                }
              : {
                  height:
                    files.length <= 10
                      ? "94px"
                      : files.length <= 20
                      ? "186px"
                      : "288px",
                }
          }
        >
          {id === "regImgs" && (
            <span className="regImgsText">사업자 인증 회원</span>
          )}
        </label>

        <div
          className="DragDrop-Files"
          style={{
            border:
              files.length == 0 ? "none" : "2px dotted rgba(0, 0, 0, 0.1)",
          }}
        >
          {files.length > 0 && id === "titleImg" && !!img && (
            <ServicesImageOnClick
              url={files[0]}
              text="대표 이미지"
              iid={files[0].iid}
              onRemove={() => handleFilterFile(files[0].iid)}
            />
          )}

          {files.length > 0 &&
            id === "imgs" &&
            !!imgs &&
            files.map((item, index) => (
              <ServicesImageOnClick
                key={item && item.iid}
                url={item}
                text="상세 이미지"
                iid={item && item.iid}
                onRemove={() => handleFilterFile(item.iid)}
              />
            ))}

          {files.length > 0 &&
            (id === "imgString" || id === "regImgs" || id === "addImgs") &&
            !!multiImgs &&
            files.map((item, index) => (
              <ServicesImageOnClick
                key={item && item.iid}
                url={item}
                text="이미지"
                iid={item && item.iid}
                onRemove={() => handleFilterFile(item.iid)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
