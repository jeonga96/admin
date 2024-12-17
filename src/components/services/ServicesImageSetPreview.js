import { IoMdCloudUpload } from "react-icons/io";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useRef, useState, useEffect, useCallback } from "react";

import * as API from "../../service/api";
import * as CH from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

import * as IMAGE from "../../action/image";

import ServicesImageOnClick from "./ServicesImageOnClick";
import Loading from "../piece/PieceLoading";

export default function ImageSet({
  req,
  id,
  title,
  disabled,
  maxLangImage = 25,
}) {
  const dispatch = useDispatch();

  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  const img = useSelector((state) => state.image.imgData, shallowEqual);
  const imgs = useSelector((state) => state.image.imgsData, shallowEqual);
  const multiImgs = useSelector(
    (state) => state.image.multiImgsData,
    shallowEqual
  );

  const [files, setFiles] = useState([]);
  const [hover, setHover] = useState(false);

  const dragRef = useRef(null);
  let [loading, setLoading] = useState(false);

  const fnState = (files) => {
    if (id === "titleImg") {
      dispatch(IMAGE.serviceImgData(files));
    } else if (id === "imgs") {
      dispatch(IMAGE.serviceimgsData(files));
    } else if (
      id === "imgString" ||
      id === "regImgs" ||
      id === "addImgs" ||
      id === "regimgs"
    ) {
      dispatch(IMAGE.servicemulTiImgsData(files));
    }
    return setLoading(false);
  };

  CH.useDidMountEffect(() => {
    if (!!getedData.titleImg && id === "titleImg") {
      API.servicesPostData(APIURL.urlGetImages, {
        imgs: getedData.titleImg,
      }).then((res) => {
        if (res.status === "success") {
          fnState(res.data);
          setFiles(res.data);
        }
      });
    } else if (!!getedData.imgs && id === "imgs") {
      API.servicesPostData(APIURL.urlGetImages, {
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
      !!getedData.regimgs ||
      !!getedData.addImgs
    ) {
      if (
        id === "imgString" ||
        id === "regImgs" ||
        id === "addImgs" ||
        id === "regimgs"
      ) {
        API.servicesPostData(APIURL.urlGetImages, {
          imgs:
            getedData.imgString ||
            getedData.regImgs ||
            getedData.addImgs ||
            getedData.regimgs,
        }).then((res) => {
          if (res.status === "success") {
            fnState(res.data);
            setFiles(res.data);
          }
        });
      }
    }
  }, [getedData, getedData.titleImg, getedData.imgs]);

  const onChangeFiles = useCallback(
    (e) => {
      e.preventDefault();
      setLoading(true);

      let selectFiles = [];
      if (e.type === "drop") {
        selectFiles = e.dataTransfer.files;
      } else {
        selectFiles = e.target.files;
      }

      const formData = new FormData();
      for (let i = 0; i < selectFiles.length; i++) {
        if (selectFiles[i].size > 20000000) {
          setLoading(false);
          return alert("20MB 용량 미만의 이미지만 등록 가능합니다.");
        }
        formData.append("Imgs", selectFiles[i]);
      }

      API.servicesPostDataForm(APIURL.urlUpImages, formData).then((res) => {
        // try {
        if (res.status === "success") {
          console.log("id", id);
          console.log("post", res);
          console.log("multiImgs", e.type);
          if (res.data.length == 1) {
            if (id === "titleImg") {
              setFiles(() => [res.data[0]]);
              fnState([res.data[0]]);
            } else if (id === "regImgs") {
              fnState([res.data[0]]);
              setFiles([res.data[0]]);
            } else {
              if (id === "imgs") {
                fnState([...imgs, res.data[0]]);
                setFiles((prev) => [res.data[0], ...prev]);
              } else {
                fnState([...multiImgs, res.data[0]]);
                setFiles((prev) => [res.data[0], ...prev]);
              }
            }
          } else if (res.data.length > 1 && res.data.length < maxLangImage) {
            if (id === "regImgs") {
              console.log("????????");
              fnState([res.data[0]]);
              setFiles([res.data[0]]);
            } else {
              const arrData = [];
              for (let i = 0; i < res.data.length; i++) {
                setFiles((prev) => [res.data[i], ...prev]);
                arrData.push(res.data[i]);
              }
              fnState([...arrData, ...files]);
            }
          } else {
            setLoading(false);
            TOA.servicesUseToast(
              `이미지는 최대 ${maxLangImage}개까지 입력하실 수 있습니다.`
            );
            return;
          }
        } else {
          console.log("else");
          console.log(res);
          setLoading(false);
          TOA.servicesUseToast("이미지가 업로드되지 않았습니다.", "e");
        }
      });
    },
    [files]
  );

  const handleFilterFile = useCallback(
    (iid) => {
      setFiles(files.filter((it) => it.iid !== iid));
      if (id === "titleImg") {
        dispatch(IMAGE.serviceImgData(img.filter((it) => it.iid !== iid)));
      } else if (id === "imgs") {
        dispatch(IMAGE.serviceimgsData(imgs.filter((it) => it.iid !== iid)));
      } else {
        dispatch(
          IMAGE.servicemulTiImgsData(multiImgs.filter((it) => it.iid !== iid))
        );
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
        <label className="blockLabel">
          <span>
            {title}
            {req ? " *" : ""}
          </span>
        </label>
        <label className="imgBtn" htmlFor={id} ref={dragRef}>
          이미지 추가
        </label>
      </div>

      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="imgsThumbnail"
        style={
          disabled
            ? {
                backgroundColor: "rgba(239, 239, 239, 0.3)",
                height:
                  files.length <= 10
                    ? "104px"
                    : files.length <= 20
                    ? "196px"
                    : "286px",
              }
            : {
                height:
                  files.length <= 10
                    ? "104px"
                    : files.length <= 20
                    ? "196px"
                    : "286px",
              }
        }
      >
        <input
          type="file"
          id={id}
          style={{ display: "none" }}
          multiple={id === "titleImg" || id === "regImgs" ? false : true}
          onChange={onChangeFiles}
          disabled={disabled ? true : false}
        />
        <label
          htmlFor={id}
          ref={dragRef}
          className={hover ? "imgsUploadhover" : ""}
          style={{
            height:
              files.length <= 10
                ? "94px"
                : files.length <= 20
                ? "186px"
                : "288px",
          }}
        >
          <IoMdCloudUpload />
          <span>여기에 파일을</span>
          <span>끌어다 놓습니다.</span>
        </label>

        <div
          className="DragDrop-Files"
          style={{
            border:
              files.length == 0 ? "none" : "2px dotted rgba(0, 0, 0, 0.1)",
          }}
        >
          <Loading loading={loading} />

          {files.length > 0 && id === "titleImg" && !!img && (
            <ServicesImageOnClick
              url={files[0]}
              text="대표 이미지"
              iid={files[0].iid}
              onRemove={() => handleFilterFile(files[0].iid)}
              disabled={disabled ? true : false}
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
                disabled={disabled ? true : false}
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
                id={id}
                disabled={disabled ? true : false}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
