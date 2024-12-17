// 회원관리 > 통합회원 관리 리스트
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import * as API from "../../service/api";
import * as CUS from "../../service/customHook";
import * as APIURL from "../../service/string/apiUrl";
import * as TOA from "../../service/library/toast";
import * as MO from "../../service/library/modal";

import * as RAN from "../../service/useData/rander";
import * as FM from "../../service/useData/format";
import * as RC from "../../service/useData/roleCheck";

import * as PAGE from "../../action/page";

import PageButton from "../../components/services/ServicesPaginationButton_Redux";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

export default function ListUser() {
  // 목록 데이터
  const [contentsList, setContentsList] = useState([]);
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData, shallowEqual);

  CUS.useMountEffect(() => {
    API.servicesPostData(APIURL.urlListResignUser, {
      offset: pageData.getPage,
      size: 15,
    }).then((res) => {
      setContentsList(res.data);
      dispatch(PAGE.setListPage(res.page));
    });
  }, [pageData.getPage]);

  const fnUseFlag = async (item) => {
    const RES_UerList = await API.servicesPostData(APIURL.urlUserlist, {
      offset: 0,
      size: 15,
      userid: item.userid,
    });

    console.log(RES_UerList);

    // 아이디로 uid 조회가 안 될 때
    if (RES_UerList.status === "fail") {
      // 회원 삭제는 진행하지 못하고, resignuser만 관리한다.
      MO.servicesUseModalNoId(
        `아이디가 존재하지 않습니다.`,
        `탈퇴요청을 선택해도 회원 정보는 삭제되지 않습니다.
        삭제 진행을 위해 이메일 (${item.email}) 로 연락 해주십시오.`,
        async () => {
          const RES_SetResignUser = await API.servicesPostData(
            APIURL.urlSetResignUser,
            {
              rsid: item.rsid,
              useFlag: 0,
            }
          );
          console.log(RES_SetResignUser);
          if (RES_SetResignUser.status === "success") {
            TOA.servicesUseToast("탈퇴요청 처리가 진행되었습니다.", "s");
            RAN.serviesAfter2secondReload();
          }
        },
        () => {
          console.log("취소");
        }
      );
      return;
    }

    // 아이디로 uid 조회가 될 때
    if (RES_UerList.status === "success") {
      const RES_Cid = await API.servicesPostData(APIURL.urlGetUserCid, {
        uid: RES_UerList.data[0].uid,
      });

      // 사업자 회원  ================================================
      if (RES_Cid.status === "success") {
        const today = new Date();
        const TODAY = FM.serviesDatetoISOString(today);

        const RES_GetCompanyDetail = await API.servicesPostData(
          APIURL.urlGetCompanyDetail,
          {
            rcid: RES_Cid.data.cid,
          }
        );

        // 비활성화를 위해 안심번호 여부 확인 후 안심번호 삭제
        const RES_extnum = RES_GetCompanyDetail.data?.extnum;

        console.log(RES_extnum);
        if (RES_extnum) {
          const VNO = RES_extnum.replaceAll("-", "");
          API.servicesPostData(APIURL.urlClear050, { vno: VNO }).then(() => {
            console.log(VNO, "삭제");
          });
        }

        const RES_STATUS = RC.serviesCheckSafeNum(
          RES_GetCompanyDetail.data?.mobilenum,
          RES_GetCompanyDetail.data?.telnum,
          !!RES_GetCompanyDetail.data?.ruid
        );
        // 회사 상세 정보 설정
        const companyDetailValue = {
          rcid: RES_Cid.data.cid,
          useFlag: 0,
          cancelDate: TODAY.substring(0, 10),
          ...(RES_extnum && { extnum: "", status: RES_STATUS }),
        };

        // 연결된 값 수정
        const RES_SetCompany = await API.servicesPostData(
          APIURL.urlSetCompany,
          {
            cid: RES_Cid.data.cid,
            useFlag: 0,
          }
        );

        const RES_SetCompanyDetail = await API.servicesPostData(
          APIURL.urlSetCompanyDetail,
          companyDetailValue
        );

        const RES_UserCompany = await API.servicesPostData(APIURL.urlSetUser, {
          uid: RES_UerList.data[0].uid,
          useFlag: 0,
        });
        const RES_SetResignUser = await API.servicesPostData(
          APIURL.urlSetResignUser,
          {
            rsid: item.rsid,
            useFlag: 0,
          }
        );

        console.log("1", RES_SetCompany);
        console.log("2", RES_SetCompanyDetail);
        console.log("3", RES_UserCompany);
        console.log("4", RES_SetResignUser);

        if (
          (RES_SetCompany.status === "success" ||
            RES_SetCompanyDetail.status === "success") &&
          RES_UserCompany.status === "success" &&
          RES_SetResignUser.status === "success"
        ) {
          TOA.servicesUseToast(`${item.userid}가 삭제되었습니다.`, "s");
          RAN.serviesAfter2secondReload();
        }
      } //if -  search - cid

      // 일반회원 ================================================
      if (RES_Cid.status === "fail") {
        console.log("일반회원 삭제");
        const RES_UserCompany = await API.servicesPostData(APIURL.urlSetUser, {
          uid: RES_UerList.data[0].uid,
          useFlag: 0,
        });
        const RES_SetResignUser = await API.servicesPostData(
          APIURL.urlSetResignUser,
          {
            rsid: item.rsid,
            useFlag: 0,
          }
        );

        console.log("1", RES_UserCompany);
        console.log("2", RES_SetResignUser);
        if (
          RES_UserCompany.status === "success" &&
          RES_SetResignUser.status === "success"
        ) {
          TOA.servicesUseToast(`${item.userid}가 삭제되었습니다.`, "s");
          RAN.serviesAfter2secondReload();
        }
      }
    } // if - search id
  };

  return (contentsList == [] && contentsList.length == 0) ||
    contentsList === undefined ? (
    <>
      <ComponentErrorNull />
    </>
  ) : (
    <>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "7%" }}>번호</th>
                <th style={{ width: "10%" }}>아이디</th>
                <th style={{ width: "18%" }}>이메일</th>
                <th style={{ width: "auto" }}>탈퇴사유</th>
                <th style={{ width: "8%" }}>등록일</th>
                <th style={{ width: "8%" }}>탈퇴일</th>
                <th style={{ width: "10%" }}>탈퇴 처리</th>
              </tr>
            </thead>
            <tbody>
              {/* checkbox를 별도로 관리하기 위해 컴포넌트로 관리 */}
              {contentsList &&
                contentsList.map((item, index) => (
                  <tr
                    key={item.rsid}
                    style={
                      item.useFlag === 1
                        ? {
                            height: "auto",
                            minHeight: "36px",
                          }
                        : {
                            height: "auto",
                            minHeight: "36px",
                            backgroundColor: "#f6f5f4",
                          }
                    }
                  >
                    <td>{contentsList.length - index}</td>
                    <td>{item.userid}</td>
                    <td>{item.email}</td>
                    <td
                      style={{
                        height: "auto",
                        minHeight: "36px",
                        whiteSpace: "wrap",
                        padding: "12px 4px",
                      }}
                    >
                      {item.resignReason}
                    </td>

                    <td>{item.createTime.substring(0, 10)}</td>
                    <td>{item.updateTime.substring(0, 10)}</td>
                    <td>
                      <button
                        onClick={() => fnUseFlag(item)}
                        className="tableIcon"
                        disabled={item.useFlag === 1 ? false : true}
                        style={
                          item.useFlag === 1
                            ? {
                                backgroundColor: "#167d88",
                                fontSize: "0.725rem",
                                lineHeight: "1.65",
                                height: "auto",
                                widows: "auto",
                                padding: "2px 10px",
                              }
                            : {
                                backgroundColor: "#bdbdbd",
                                fontSize: "0.725rem",
                                lineHeight: "1.65",
                                height: "auto",
                                widows: "auto",
                                padding: "2px 10px",
                                cursor: "default",
                              }
                        }
                      >
                        {item.useFlag === 1 ? "진행" : "완료"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <PageButton />
        </div>
      </section>
    </>
  );
}
