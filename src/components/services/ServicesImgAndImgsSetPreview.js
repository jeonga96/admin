import { IoMdCloudUpload } from "react-icons/io";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useRef, useState, useEffect, useCallback } from "react";

import * as API from "../../service/api";
import * as CH from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";
import * as UDIMAGE from "../../service/useData/image";
import * as TOA from "../../service/library/toast";

import * as IMAGE from "../../action/image";
import * as CUS from "../../service/customHook";

import ServicesImageOnClick from "./ServicesImageOnClick";
import ServiceModalAddImgsView from "./ServiceModalAddImgsView";
import Loading from "../piece/PieceLoading";

export default function ServicesImgAndImgsSetPreview({ req, disabled }) {
  const dispatch = useDispatch();

  const getedData = useSelector((state) => state.data.getedData, shallowEqual);
  const imgs = useSelector((state) => state.image.imgsData, shallowEqual);
  const titleImg = useSelector((state) => state.image.imgData, shallowEqual);

  // imgs 배열 저장되는 state
  const [files, setFiles] = useState([]);
  // titleimg 배열에 저장되는 state
  const [titleFile, setTitleFile] = useState(null);
  // 대표이미지 iid 저장
  const [selectTitle, setSelectTitle] = useState(0);
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
  };

  // 대표이미지 이미지 선택 & 해지
  const fnTitleSelect = (item, rcid) => {
    const isNewTitleSelected = selectTitle !== item.iid;

    if (isNewTitleSelected) {
      // 새 대표 이미지 설정
      setTitleFile(item);
      setSelectTitle(item.iid);
      // localStorage.setItem('titleImg', item.iid.toString()); // 대표 이미지 ID 저장
      localStorage.setItem("isTitleImageSet", "true"); // 로컬 스토리지에 설정 유무만 저장
      const updatedFiles = files.filter((file) => file.iid !== item.iid);
      setFiles(updatedFiles);
      dispatch(IMAGE.serviceImgData(item.iid));
      const updatedImgs = imgs.filter((img) => img.iid !== item.iid);
      if (titleFile) updatedImgs.push(titleFile);
      dispatch(IMAGE.serviceimgsData(updatedImgs));
    } else {
      // 대표 이미지 해제 로직
      setTitleFile(null);
      setSelectTitle(0);
      // localStorage.removeItem('titleImg'); // 로컬 스토리지에서 대표 이미지 ID 삭제
      localStorage.setItem("isTitleImageSet", "false"); // 대표 이미지가 설정되어 있지 않음을 표시
      dispatch(IMAGE.serviceImgData(0));
      const updatedImgs = [...imgs];
      if (titleFile) updatedImgs.push(titleFile);
      dispatch(IMAGE.serviceimgsData(updatedImgs));
    }
    // console.log('대표 이미지 변경:', isNewTitleSelected, '현재 대표 이미지 ID:', item.iid);
  };

  useEffect(() => {
    if (selectTitle === 0) {
      localStorage.setItem("isTitleImageSet", "false");
      console.log("로컬 스토리지에 대표 이미지 해제 설정");
    }
  }, [selectTitle]);

  useEffect(() => {
    const savedTitleImg = localStorage.getItem("isTitleImageSet");
    if (savedTitleImg) {
      // dispatch(IMAGE.serviceImgData(parseInt(savedTitleImg)));
      dispatch(IMAGE.serviceImgData(titleImg || getedData.titleImg));
    }
  }, [dispatch]);

  // 업종선택 모달에서 저장한 이미지 가져와 렌더링
  CH.useDidMountEffect(() => {
    setFiles([...files, ...imgs]);
    UDIMAGE.serviesUniqueIid(imgs, setFiles, files);
  }, [imgs]);

  // getedData에 저장된 이미지 가져와 렌더링
  CH.useDidMountEffect(() => {
    // getedData.imgs가 정의되지 않았거나 빈 문자열인 경우, 빈 배열을 사용
    const imgsArray = getedData.imgs ? getedData.imgs.split(",") : [];
    const titleImgArray = getedData.titleImg
      ? [getedData.titleImg.toString()]
      : [];
    const imgIds = [...imgsArray, ...titleImgArray].filter(
      (id) => id.trim() !== ""
    );

    // const setErrorImage = () => {
    //   const errorImage = { iid: "", storagePath: "./data/errorimage.png" };

    //   // titleImg이 있을 경우와 없을 경우를 나누어 처리
    //   if (getedData.titleImg) {
    //     console.log("??");
    //     setTitleFile(errorImage);
    //     setSelectTitle(errorImage);
    //     // localStorage.setItem("isTitleImageSet", "false");

    //     // dispatch(IMAGE.serviceImgData("")); // 리덕스에 대표 이미지의 IID만 저장
    //   }

    //   if (imgsArray.length > 0) {
    //     const errorImages = imgsArray.map(() => errorImage);
    //     fnState(errorImages);
    //     setFiles(errorImages);
    //   }
    // };

    if (imgIds.length > 0) {
      API.servicesPostData(APIURL.urlGetImages, { imgs: imgIds.join(",") })
        .then((res) => {
          if (res.status === "success") {
            // 대표 이미지와 일반 이미지를 분리합니다.
            const titleImageData = res.data.find(
              (d) => d.iid === parseInt(getedData.titleImg, 10)
            );
            const normalImagesData = res.data.filter(
              (d) => d.iid !== parseInt(getedData.titleImg, 10)
            );

            if (titleImageData) {
              // 대표 이미지 상태 업데이트
              setTitleFile(titleImageData);
              setSelectTitle(getedData.titleImg);
            }

            if (normalImagesData.length > 0) {
              // 일반 이미지 상태 업데이트
              fnState(normalImagesData);
              setFiles(normalImagesData);
            }
          } else {
            // setErrorImage();
          }
        })
        .catch((error) => {
          console.error("이미지 정보를 불러오는 중 오류 발생:", error);
          // setErrorImage();
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

      const totalImages = imgs.length + selectFiles.length;
      const maxImages = titleFile ? 8 : 9;

      if (totalImages > maxImages) {
        setLoading(false);
        const message = titleFile
          ? "대표 이미지가 설정되어 있을 경우, 최대 8개의 이미지만 등록할 수 있습니다."
          : "대표 이미지가 설정되어 있지 않을 경우, 최대 9개의 이미지를 등록할 수 있습니다.";
        TOA.servicesUseToast(message, "e");
        return;
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
        if (res.status === "success") {
          const newFiles = res.data;
          const isFirstImage = !titleFile && files.length === 0;

          if (isFirstImage) {
            setTitleFile(newFiles[0]); // UI를 위해 파일 객체 전체를 상태에 저장
            setSelectTitle(newFiles[0].iid); // 선택된 대표 이미지의 ID를 상태에 저장
            dispatch(IMAGE.serviceImgData(newFiles[0].iid)); // 리덕스에 대표 이미지의 IID만 저장
            console.log("새 대표 이미지 설정됨:", newFiles[0].iid);
            localStorage.setItem("isTitleImageSet", "true"); // 로컬 스토리지 설정
            newFiles.shift(); // 대표 이미지로 설정된 첫 번째 이미지 제거
          }

          fnState([...files, ...newFiles]);
        } else {
          setLoading(false);
          TOA.servicesUseToast("이미지가 업로드되지 않았습니다.", "e");
        }
      });
    },
    [files, imgs, selectTitle, titleFile, dispatch]
  );

  // 이미지 추가 중복제거
  const handleFilterFile = useCallback(
    (iid) => {
      setFiles(files.filter((it) => it.iid !== iid));
      if (iid === selectTitle) {
        const newImgs = [...imgs, titleFile].filter(Boolean); // 현재 대표 이미지를 imgs 배열에 추가
        dispatch(IMAGE.serviceimgsData(newImgs)); // 업데이트된 imgs 배열을 리덕스에 저장
        dispatch(IMAGE.serviceImgData(0)); // 대표 이미지 정보를 0으로 초기화
        setSelectTitle(0); // 대표 이미지 선택 상태 초기화
        setTitleFile(null); // 대표 이미지 파일 상태 초기화
      } else {
        // 제거하려는 이미지가 대표 이미지가 아니면 imgs 배열에서 해당 이미지 제거
        dispatch(IMAGE.serviceimgsData(imgs.filter((it) => it.iid !== iid)));
      }
    },
    [files, imgs, selectTitle, titleFile]
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

  const onImagesSelected = (selectedImages) => {
    const titleImage = selectedImages.find((img) => img.isTitleImage);
    const otherImages = selectedImages.filter((img) => !img.isTitleImage);

    if (titleImage) {
      setTitleFile(titleImage);
      setSelectTitle(titleImage.iid);
    }
    setFiles([...files, ...otherImages]);
  };

  return (
    <div className="setImageWrap">
      <div>
        <label className="blockLabel">
          <span>이미지 {req ? " *" : ""}</span>
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
        onImagesSelected={onImagesSelected}
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
            outline:
              files.length == 0 ? "none" : "2px dotted rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className="titleImageSection"
            style={{
              backgroundColor: titleFile ? "#393939" : "#fff",
              display: "flex",
              flexDirection: "column-reverse",
              alignItems: "center",
            }}
          >
            {titleFile ? (
              <>
                <span>대표 사진</span>
                <ServicesImageOnClick
                  key={titleFile.iid}
                  url={titleFile}
                  text="대표 사진"
                  iid={titleFile.iid}
                  onRemove={() => handleFilterFile(titleFile.iid)}
                  onSelect={fnTitleSelect}
                  titleImg={selectTitle === titleFile.iid} // 수정된 부분
                  disabled={disabled}
                  titleImgAbj
                />
              </>
            ) : (
              <p style={{ textAlign: "center", lineHeight: "86px" }}>
                대표 사진 *
              </p>
            )}
          </div>
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
                titleImg={selectTitle === item.iid}
                disabled={disabled}
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
