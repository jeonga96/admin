// // import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { useForm } from "react-hook-form";

// // import * as API from "../../service/api";
// import * as UD from "../../service/useData";
// import * as STR from "../../service/string";

// import LayoutTopButton from "../../components/layout/LayoutTopButton";
// import PieceLoading from "../../components/piece/PieceLoading";

// export default function Set050Ment() {
//   // const navigate = useNavigate();
//   const {
//     handleSubmit,
//     register,
//     setValue,
//     getValues,
//     watch,
//     formState: { isSubmitting },
//   } = useForm({
//     defaultValues: {
//       _channelId: "wazzang",
//     },
//   });
//   const { mentid } = useParams();
//   const [bgmList, setBgmList] = useState([]);
//   const [mentFile, setMentFile] = useState([]);
//   // loading:true -> loading중
//   const [loading, setLoading] = useState(false);

//   // useEffect(() => {
//   //   if (!!mentid) {
//   //     API
//   //       .servicesGet050biz
//   //       // STR.urlGet050,{}
//   //       ()
//   //       .then((res) => {
//   //         setLoading(true);
//   //         if (res.status === "success") {
//   //           setLoading(false);
//   //           console.log("목록 잘 나왔나요?", res);
//   //           setValue("_channelId", res.data.channelId);
//   //           setValue("_type", res.data.type);
//   //           setValue("_fileName", res.data.fileName);
//   //           setValue("_title", res.data.title);
//   //           setValue("_musicMethod", res.data.musicMethod);
//   //           setValue("_ttsMsg", res.data.ttsMsg);
//   //           setValue("bgmFile", res.data.bgmFile);
//   //         }
//   //       });
//   //   }
//   // }, []);

//   // musicMethot가 1번일 떄, 050biz ment에서 bgm목록 확인하여 가져오기
//   // useEffect(() => {
//   //   API.servicesPost050bizMent(
//   //     `${STR.urlPre050Biz}/050biz/v1/${watch("_channelId")}/bgm`,
//   //     { channelId: watch("_channelId") }
//   //   ).then((res) => {
//   //     setLoading(true);
//   //     if (res.code === "0000") {
//   //       setLoading(false);
//   //       setBgmList(res.data);
//   //       console.log(bgmList);
//   //     } else {
//   //       UD.servicesUseToast("bgm이 없습니다.", "e");
//   //       setLoading(false);
//   //     }
//   //   });
//   // }, [watch("_musicMethod") === "1"]);

//   const fnMentFile = (e) => {
//     e.preventDefault();
//     const files = e.target.files;
//     const formData = new FormData();
//     formData.append("file", files[0]);
//     setMentFile(...formData);
//   };

//   // const fnDelete = () => {
//   //   API.servicesPost050bizMent(
//   //     `${STR.urlPre050Biz}/050biz/v1/${watch(
//   //       "_channelId"
//   //     )}/ment/delete/${mentid}`,
//   //     {}
//   //   ).then((res) => console.log("삭제됐나요?", res));
//   // };

//   const fnCreateSubmit = () => {
//     axios
//       .post(
//         "https://050biz.sejongtelecom.net:8443/050biz/v1/wazzang/ment/create",
//         {
//           title: getValues("_title"),
//           ttsMsg: getValues("_ttsMsg"),
//           // bgmFile: getValues("_bgmFile"),
//           type: getValues("_type"),
//           musicMethod: getValues("_musicMethod"),
//           // mentFile: mentFile[1],
//         },
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3YXp6YW5nIiwiaWF0IjoxNjg4NzIxMTM2fQ.jLPuAYz28mNeaJ7MFS4fRWND2-6Ya2AZKtTDxFyWQpsASJOdD5Fknz7qXfay6cVO7E6W8HYzkf2avncwF6Rvkg`,
//           },
//         }
//       )
//       .then((res) => console.log(res))
//       .catch((error) =>
//         console.log("importData.servicesPost050bizMent", error)
//       );

//     //   API.servicesPost050bizMent(
//     //     `${STR.urlPre050Biz}/050biz/v1/${watch("_channelId")}/ment/create`,
//     //     {
//     //       title: getValues("_title"),
//     //       ttsMsg: getValues("_ttsMsg"),
//     //       bgmFile: getValues("_bgmFile"),
//     //       mentFile: mentFile[1],
//     //     }
//     //   ).then((res) => console.log(res));
//     // };

//     // const fnUpdateSubmit = () => {
//     //   API.servicesPost050bizMent(
//     //     `${STR.urlPre050Biz}/050biz/v1/${watch(
//     //       "_channelId"
//     //     )}/ment/update/${mentid}`,
//     //     {
//     //       title: getValues("_title"),
//     //       ttsMsg: getValues("_ttsMsg"),
//     //       bgmFile: getValues("_bgmFile"),
//     //       mentFile: mentFile[1],
//     //     }
//     //   ).then((res) => console.log(res));
//   };

//   // 수정 & 추가 버튼 클릭 이벤트
//   function fnSubmit() {
//     fnCreateSubmit();
//     // !!mentid ? fnUpdateSubmit() : fnCreateSubmit();
//   }

//   return (
//     <>
//       <PieceLoading loading={loading} bg />
//       <div className="commonBox">
//         <form className="formLayout" onSubmit={handleSubmit(fnSubmit)}>
//           <ul className="tableTopWrap tableTopBorderWrap">
//             {/* <LayoutTopButton url={`/company/${cid}`} text="상세정보 가기" /> */}
//             {/* {!!mentid && <LayoutTopButton text="삭제" fn={fnDelete} />} */}
//             <LayoutTopButton text="완료" disabled={isSubmitting} />
//           </ul>
//           <div className="formWrap">
//             <fieldset id="CompanyDetail_1">
//               <h3>050 멘트 관리</h3>

//               {/* setDetailUserInfo  ================================================================ */}
//               <div className="formContentWrap" style={{ width: "100%" }}>
//                 <label htmlFor="channelId" className=" blockLabel">
//                   <span>채널ID</span>
//                 </label>
//                 <div
//                   style={{ display: "flex", justifyContent: "space-between" }}
//                 >
//                   <input
//                     type="text"
//                     id="channelId"
//                     maxLength="10"
//                     placeholder="영문으로 입력해주십시오."
//                     style={{ width: "91.5%" }}
//                     value={
//                       (watch("_channelId") &&
//                         watch("_channelId").replace(/[^A-Za-z]/gi, "")) ||
//                       ""
//                     }
//                     {...register("_channelId")}
//                   />

//                   <button
//                     type="button"
//                     className="formContentBtn"
//                     onClick={() => setValue("_channelId", "wazzang")}
//                   >
//                     기본ID
//                   </button>
//                 </div>
//               </div>

//               <div className="formContentWrap">
//                 <label htmlFor="_type" className="blockLabel">
//                   <span>멘트 타입</span>
//                 </label>
//                 <div>
//                   <select {...register("_type")} style={{ width: "100%" }}>
//                     <option value="1">컬러링</option>
//                     <option value="2">착신멘트</option>
//                     <option value="3">업무외멘트</option>
//                     <option value="4">휴일멘트</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="formContentWrap">
//                 <label htmlFor="title" className=" blockLabel">
//                   <span>파일 제목</span>
//                 </label>
//                 <div>
//                   <input
//                     type="text"
//                     id="title"
//                     maxLength="10"
//                     {...register("_title")}
//                   />
//                 </div>
//               </div>

//               <div className="formContentWrap" style={{ width: "100%" }}>
//                 <label htmlFor="_musicMethod" className="blockLabel">
//                   <span>멘트 방법 설정</span>
//                 </label>
//                 <div>
//                   <select
//                     {...register("_musicMethod")}
//                     style={{ width: "100%" }}
//                   >
//                     <option value="0">TTS</option>
//                     <option value="1">TTS+배경음악</option>
//                     <option value="2">사용자파일</option>
//                   </select>
//                 </div>
//               </div>

//               {watch("_musicMethod") !== "2" && (
//                 <div className="formContentWrap" style={{ width: "100%" }}>
//                   <label htmlFor="ttsMsg" className="blockLabel">
//                     <span>TTS 메시지</span>
//                   </label>
//                   <div>
//                     <input
//                       type="text"
//                       id="ttsMsg"
//                       maxLength="80"
//                       {...register("_ttsMsg")}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* bgm 목록 조회 */}
//               {watch("_musicMethod") === "1" && (
//                 <div className="formContentWrap" style={{ width: "100%" }}>
//                   <label htmlFor="bgmFile" className="blockLabel">
//                     <span>배경음악파일명</span>
//                   </label>
//                   <div>
//                     <select {...register("_bgmFile")} style={{ width: "100%" }}>
//                       {bgmList &&
//                         bgmList.map((res) => (
//                           <option value={res.bgmFile}>{res.name}</option>
//                         ))}
//                     </select>
//                   </div>
//                 </div>
//               )}
//               {watch("_musicMethod") === "2" && (
//                 <div className="formContentWrap" style={{ width: "100%" }}>
//                   <label htmlFor="bgmFile" className="blockLabel">
//                     <span>사용자파일</span>
//                   </label>
//                   <div>
//                     <div className="basicInputWrap">
//                       <label
//                         htmlFor="mentFile"
//                         className="blind"
//                         style={{ width: "20px" }}
//                       />

//                       <label htmlFor="mentFile" className="basicModifyBtn">
//                         오디오 등록
//                       </label>
//                       <input
//                         type="file"
//                         id="mentFile"
//                         accept="audio/*"
//                         className="blind"
//                         onChange={fnMentFile}
//                         style={{ width: "1px", height: "1px" }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </fieldset>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }
