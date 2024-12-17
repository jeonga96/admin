// 변경 전 이미지관리 컴포넌트
import { IoMdCloudUpload } from "react-icons/io";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useRef, useState, useEffect, useCallback } from "react";

import * as API from "../../service/api";
import * as CH from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";

import * as IMAGE from "../../action/image";

import ServicesImageOnClick from "./ServicesImageOnClick";
import ServiceModalAddImgsView from "./ServiceModalAddImgsView";
import Loading from "../piece/PieceLoading";

export default function ServicesImgAndImgsSetPreview({ disabled }) {
  const dispatch = useDispatch();

  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  const imgs = useSelector((state) => state.image.imgsData, shallowEqual);

  // imgs 배열 저장되는 state
  const [files, setFiles] = useState([]);
  // 대표이미지 iid 저장
  const [selectTitle, setSelectTitle] = useState("");
  // 이미지 끌어와서 저장하는 호버이벤트
  const [hover, setHover] = useState(false);
  // 업종사진 모달창
  const [modalView, setModalView] = useState(false);
  // 로딩
  let [loading, setLoading] = useState(false);
  const dragRef = useRef(null);

  // 다중이미지 업로드 시 대기중 화면
  const fnState = (newFiles) => {
    dispatch(IMAGE.serviceimgsData(newFiles));

    setLoading(false);
    setFiles(newFiles);
    // Set the first image as title image if there is none yet
    if (newFiles.length > 0 && selectTitle === 0) {
      setSelectTitle(newFiles[0].iid);
    }
  };

  // 대표이미지 이미지 선택 & 해지
  const fnTitleSelect = (item) => {
    dispatch(IMAGE.serviceImgData(selectTitle === item.iid ? 0 : item.iid));

    setSelectTitle(selectTitle === item.iid ? 0 : item.iid);
  };

  // 업종선택 모달에서 저장한 이미지 가져와 렌더링
  CH.useDidMountEffect(() => {
    setFiles([...files, ...imgs]);
    UD.serviesUniqueIid(imgs, setFiles, files);
  }, [imgs]);

  // getedData에 저장된 이미지 가져와 렌더링
  CH.useDidMountEffect(() => {
    if (!!getedData.imgs) {
      API.servicesPostData(APIURL.urlGetImages, {
        imgs: getedData.imgs,
      }).then((res) => {
        if (res.status === "success") {
          fnState(res.data);
          setFiles(res.data);
          setSelectTitle(getedData.titleImg);
        }
      });
    }
  }, [getedData]);

  // 이미지 추가 이벤트
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

      if (imgs.length + selectFiles.length > 8) {
        setLoading(false);
        TOA.servicesUseToast(
          "이미지는 최대 8개까지 입력하실 수 있습니다.",
          "e"
        );
        return;
      }

      const formData = new FormData();
      for (let i = 0; i < selectFiles.length; i++) {
        console.log("selectFiles : ", selectFiles[i]);
        if (selectFiles[i].size > 20000000) {
          setLoading(false);
          return alert("20MB 용량 미만의 이미지만 등록 가능합니다.");
        }
        formData.append("Imgs", selectFiles[i]);
      }

      API.servicesPostDataForm(APIURL.urlUpImages, formData).then((res) => {
        try {
          if (res.status === "success") {
            const newFiles = [...imgs, ...res.data];
            if (newFiles.length && selectTitle === "") {
              setSelectTitle(newFiles[0].iid);
              dispatch(IMAGE.serviceImgData(newFiles[0].iid));
            }
            fnState(newFiles);
          } else {
            setLoading(false);
            TOA.servicesUseToast("이미지가 업로드되지 않았습니다.", "e");
          }
        } catch {
          setLoading(false);
          TOA.servicesUseToast("이미지가 업로드되지 않았습니다.", "e");
        }
      });
    },
    [files, imgs, selectTitle]
  );

  // 이미지 추가 중복제거
  const handleFilterFile = useCallback(
    (iid) => {
      setFiles(files.filter((it) => it.iid !== iid));
      dispatch(IMAGE.serviceimgsData(imgs.filter((it) => it.iid !== iid)));
    },
    [files]
  );

  // 드로그앤 드롭으로 이미지 추가 ====================================================
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
  // 드로그앤 드롭으로 이미지 추가 종료 ================================================

  return (
    <div className="setImageWrap">
      <div>
        <label className="blockLabel">
          <span>이미지</span>
        </label>
        <div className="imgBtnWrap">
          <label className="imgBtn" htmlFor="imgs" ref={dragRef}>
            이미지 추가
          </label>

          <label
            className="imgBtn"
            htmlFor={`title_view`}
            onClick={() => setModalView(true)}
          >
            업종사진
          </label>
        </div>
        <a
          href="https://www.utoimage.com/"
          target="_blank"
          rel="noreferrer"
          className="imgBtn"
        >
          유토이미지 이동
        </a>
      </div>
      <ServiceModalAddImgsView
        setClickModal={setModalView}
        clickModal={modalView}
        currentfiles={files}
      />

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
          id="imgs"
          style={{ display: "none" }}
          multiple
          onChange={onChangeFiles}
          disabled={disabled ? true : false}
        />
        <label
          htmlFor="imgs"
          ref={dragRef}
          disabled={disabled ? true : false}
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
          {files.length > 0 && !!imgs ? (
            files.map((item, index) => (
              <ServicesImageOnClick
                key={item && item.iid}
                url={item}
                text="상세 이미지"
                iid={item && item.iid}
                onRemove={() => handleFilterFile(item.iid)}
                onSelect={() => fnTitleSelect(item)}
                titleImg={item.iid === selectTitle ? true : false}
                disabled={disabled ? true : false}
              />
            ))
          ) : (
            <p>사진 업로드 시 정사각형 비율로 적용</p>
          )}
        </div>
      </div>
    </div>
  );
}
