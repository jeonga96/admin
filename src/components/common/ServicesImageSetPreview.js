import { useRef, useState, useEffect, useCallback } from "react";
// import { BiUpload } from "react-icons/bi";
import {
  servicesPostDataForm,
  servicesPostData,
} from "../../Services/importData";
import { useDidMountEffect } from "../../Services/customHook";
import { urlUpImages, urlGetImages } from "../../Services/string";
import { servicesUseToast } from "../../Services/useData";
import ServicesImageOnClick from "./ServicesImageOnClick";

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

  const [files, setFiles] = useState([]);
  // 드래그 중일때와 아닐때의 스타일을 구분하기 위한 state 변수
  const [isDragging, setIsDragging] = useState(false);
  // 드래그 이벤트를 감지하는 ref 참조변수 (label 태그에 들어갈 예정)
  const dragRef = useRef(null);

  const fnSetImg = (res) => {
    setImg(res);
  };
  const fnSetImgs = (res) => {
    setImgs(res);
  };
  const fnSetRegImgs = (res) => {
    setRegImgs(res);
  };

  const fnStateSet = (files) => {
    if (!!setImg) {
      fnSetImg([...files]);
      return;
    } else if (!!setImgs) {
      console.log(files);
      fnSetImgs([...imgs, ...files]);
      return;
    } else if (!!setRegImgs) {
      fnSetRegImgs([...regImgs, ...files]);
      return;
    }
  };

  // 첫 렌더링을 방지하고, 기존 입력된 이미지가 있다면 서버에서 이미지를 가져온다.
  useDidMountEffect(() => {
    if (!!getData.titleImg && id === "titleImg") {
      servicesPostData(urlGetImages, {
        imgs: getData.titleImg,
      }).then((res) => {
        if (res.status === "success") {
          fnStateSet(res.data);
          setFiles(res.data);
        }
      });
    } else {
      servicesPostData(urlGetImages, {
        imgs:
          getData.imgs ||
          getData.imgString ||
          getData.regImgs ||
          getData.addImgs,
      }).then((res) => {
        if (res.status === "success") {
          fnStateSet(res.data);
          setFiles(res.data);
        }
      });
    }
  }, [getDataFinish]);

  // function handleSetImage(e) {
  // 이미지 업로드 시 실행되는 코드
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
        console.log("imgsUpload click-->", selectFiles[i]);
        formData.append("Imgs", selectFiles[i]);
      }

      // FormData에 저장된 데이터를 서버에 보냄
      servicesPostDataForm(urlUpImages, formData).then((res) => {
        if (res.data.length == 1) {
          setFiles((prev) => [res.data[0], ...prev]);
          fnStateSet(res.data);
          console.log("ddd!");
        } else if (res.data.length > 1 && res.data.length < 25) {
          for (let i = 0; i < res.data.length; i++) {
            setFiles((prev) => [res.data[i], ...prev]);
            fnStateSet(res.data);
          }
        } else {
          return servicesUseToast(
            "이미지는 최대 25개까지 입력하실 수 있습니다."
          );
        }
      });
    },
    [files]
  );

  // ------------------------------------------------------------------------------

  const handleFilterFile = useCallback(
    (iid) => {
      setFiles(files.filter((it) => it.iid !== iid));
      if (id === "titleImg") {
        fnSetImg(img.filter((it) => it.iid !== iid));
      } else if (id === "regImgs") {
        fnSetRegImgs(regImgs.filter((it) => it.iid !== iid));
      } else {
        fnSetImgs(imgs.filter((it) => it.iid !== iid));
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

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      onChangeFiles(e);
      setIsDragging(false);
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
      </div>

      <div className="imgsThumbnail">
        <input
          type="file"
          id={id}
          style={{ display: "none" }}
          multiple={id === "titleImg" ? false : true}
          onChange={onChangeFiles}
        />

        <label htmlFor={id} ref={dragRef}>
          {files.length === 0 && (
            <div style={{ position: "absolute" }}>파일 첨부</div>
          )}

          <div className="DragDrop-Files">
            {files.length > 0 && setImg && (
              <ServicesImageOnClick
                getData={img}
                url={files[0].storagePath}
                text="대표 이미지"
                iid={files[0].iid}
                onRemove={() => handleFilterFile(files[0].iid)}
              />
            )}

            {files.length > 0 &&
              !setImg &&
              files.map((item) => (
                <ServicesImageOnClick
                  key={item && item.iid}
                  getData={files}
                  url={item && item.storagePath}
                  text="상세 대표 이미지"
                  iid={item && item.iid}
                  onRemove={() => handleFilterFile(files[0].iid)}
                />
              ))}
          </div>
        </label>
      </div>
    </div>
  );
}
