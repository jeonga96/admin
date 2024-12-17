// 회원관리 > 통합회원 상세정보

import { IoMdCloudUpload, IoMdRemoveCircle } from "react-icons/io";
import { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";

import * as API from "../../service/api";
import * as TOA from "../../service/library/toast";
import * as APIURL from "../../service/string/apiUrl";
import * as UV from "../../service/useData/uniquValue";
import * as CUS from "../../service/customHook";
import * as RAN from "../../service/useData/rander";

import LayoutTopButton from "../../components/layout/LayoutTopButton";
import Loading from "../../components/piece/PieceLoading";

function ListComponent({ item, fnRemove }) {
  const { register, setValue, watch } = useForm();
  // const { register, watch } = useForm();

  CUS.useCleanupEffect(() => {
    setValue("_tag", item.tag);
  }, [item.tag, item.remarks, setValue]);

  return (
    <div>
      <img src={item.previewURL} alt={item.file.name} />
      <div>
        <span>파일 명 : {item.file.name}</span>
        <input
          placeholder="태그를 입력해 주세요 ( 필수 입력 사항 )"
          maxLength={255}
          required
          {...register("_tag", {
            onChange: () => {
              item.tag = watch("_tag").replaceAll(" ", ",");
            },
          })}
        />
        <input
          placeholder="비고를 입력해 주세요"
          maxLength={255}
          required
          {...register("_remarks", {
            onChange: () => {
              item.remarks = watch("_remarks");
            },
          })}
        />
      </div>
      <button type="button" onClick={() => fnRemove(item.file.name)}>
        <IoMdRemoveCircle />
      </button>
    </div>
  );
}

// 부모 : =========================================================
export default function SetImgs() {
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const dragRef = useRef(null);

  // 저장
  const fnSubmit = async () => {
    setLoading(true);
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].size > 20000000) {
        setLoading(false);
        return alert("20MB 용량 미만의 이미지만 등록 가능합니다.");
      }

      if (!fileList[i].tag) {
        setLoading(false);
        return alert(`${i + 1}번째 태그가 입력되지 않았습니다.`);
      }

      const formData = new FormData();
      // Imgs : multiFormData type
      formData.append("Imgs", fileList[i].file);
      // dto : json/aplication {tag, ramarks} type 으로 전송
      formData.append(
        "dto",
        new Blob(
          [
            JSON.stringify({
              tag: fileList[i].tag,
              remarks: fileList[i].remarks,
            }),
          ],
          { type: "application/json" }
        )
      );

      try {
        const res = await API.servicesPostDataForm(
          APIURL.urlupTagImages,
          formData
        );
        if (res.status === "success") {
          console.log("servicesPostDataForm success : ", res);
        } else {
          alert(`파일명 : ${fileList[i].file.name}가 저장되지 않았습니다.`);
        }
      } catch (error) {
        console.log("servicesPostDataForm error : ", error);
      }
    } // i < fileList.length : for
    setLoading(false);
    TOA.servicesUseToast(`저장되었습니다.`, "s");
    RAN.serviesAfter2secondReload(setFileList([]));
    return;
  };

  // 이미지 업로드 이벤트
  const handleSetImage = useCallback((e) => {
    e.preventDefault();
    setLoading(true);
    let newArr = [...fileList];

    let selectFiles = [];
    // drag and drop & button click
    if (e.type === "drop") {
      selectFiles = e.dataTransfer.files;
    } else {
      selectFiles = e.target.files;
    }

    for (let i = 0; selectFiles.length > i; i++) {
      // 확장자 조건 추가
      const allowedExtensions = ["gif", "jpg", "jpeg", "png"];
      const fileType = selectFiles[i].name.split(".")[1].toLowerCase();
      let CKFILETYPE = false;

      for (let a = 0; allowedExtensions.length > a; a++) {
        if (allowedExtensions[a] === fileType) {
          CKFILETYPE = true;
          break;
        }
      }

      console.log(selectFiles[i], fileList[i]);
      // 파일 이름 55글자 이내 조건 추가
      if (CKFILETYPE && selectFiles[i].name.length > 55) {
        alert(
          `55자 이내의 파일명만 업로드 가능합니다. ${
            i + 1
          }번째 이미지는 업로드 되지 않습니다.`
        );
      } else if (CKFILETYPE) {
        // 미리보기 링크 저장 & state 저장
        const reader = new FileReader();
        reader.onload = (e) => {
          newArr.push({ file: selectFiles[i], previewURL: e.target.result });
          setFileList(newArr);
        };
        reader.readAsDataURL(selectFiles[i]);
      } else {
        TOA.servicesUseToast(
          "jpg, jpeg, png, gif 외의 확장자는 저장할 수 없습니다.",
          "e"
        );
        break;
      }
    }

    // name을 통해 검사하여 중복입력되지 않도록 함수 처리
    UV.serviesUniqueName(newArr, setFileList, fileList);
    return setLoading(false);
  });

  const fnRemove = (name) => {
    setFileList((res) => res.filter((item) => item.file.name !== name));
  };

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

      handleSetImage(e);
      // setIsDragging(false);
    },
    [handleSetImage]
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
    <div className="commonBox">
      <form className="formLayout">
        <ul className="tableTopWrap tableTopBorderWrap">
          <LayoutTopButton url="/setimgs" text="목록으로 가기" />
        </ul>

        <div className="imageSetContainer">
          <div
            className={`${
              hover ? " imageUploadBox imageHover" : "imageUploadBox"
            }`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            ref={dragRef}
          >
            <IoMdCloudUpload />
            <span className="IoMdCloudUploadTitle">
              여기에 파일을 끌어다 놓습니다.
            </span>
            <div>
              <i>jpg</i>
              <i>jpeg</i>
              <i>png</i>
              <i>gif</i>
            </div>
            <div className="imageUploadSpanContanier">
              <span>- 이미지 검색 시 태그가 사용됩니다.</span>
              <span>- 태그는 , ( 쉼표 ) 로 구분</span>
              <span>- 55자 이내의 파일명으로 업로드</span>
              <span>
                ( 글자 수 제한으로 인한 업로드 오류 시 파일명 변경 후 다시
                업로드 )
              </span>
              <span>- 태그, 비고는 255자 이내로 입력</span>
            </div>
          </div>
          <div className="imageUploadListBox">
            <div>
              <label
                htmlFor="imageUploadButton"
                style={{ backgroundColor: "#757575" }}
              >
                이미지 업로드
              </label>
              <input
                type="file"
                id="imageUploadButton"
                accept="image/*"
                multiple
                onChange={handleSetImage}
                style={{ display: "none" }}
              />

              <label htmlFor="imageSubmitButton" onClick={fnSubmit}>
                저장
              </label>
              <input id="imageSubmitButton" style={{ display: "none" }} />
            </div>

            <div className="imageUploadListChildWrap">
              <Loading loading={loading} fix="SetImgs" />
              {fileList.map((item, key) => (
                <ListComponent key={key} item={item} fnRemove={fnRemove} />
              ))}
            </div>
          </div>
        </div>

        {/* formWrap */}
      </form>
    </div>
  );
}
