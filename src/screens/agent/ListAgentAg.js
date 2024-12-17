// 유통망 관리 > 지사( 총판 )관리 리스트

import { Link } from "react-router-dom";
import { useState } from "react";

import * as API from "../../service/api";
import * as APIURL from "../../service/string/apiUrl";
import * as CUS from "../../service/customHook";

import PageButton from "../../components/services/ServicesPaginationButton_Redux";
import LayoutTopButton from "../../components/layout/LayoutTopButton";
import ComponentListAgentSearch from "../../components/common/ComponentListAgentSearch";
import ComponentErrorNull from "../../components/piece/PieceErrorNull";

function ChildTd({ item }) {
  const [companyData, setCompanyData] = useState({});

  CUS.useCleanupEffect(() => {
    API.servicesPostData(APIURL.urlListDistribution, {
      offset: 0,
      size: 10,
      managetype: "AG",
    })
      .then((res) => {
        if (res.data && res.data.managetype === "AG") {
          setCompanyData(res);
          console.log(res.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <tr>
      <td className="tableButton">
        <Link to={`${item.daid}`} className="Link">
          {item.daid}
        </Link>
      </td>
      <td>{item.name}</td>
      <td>{item.afflname}</td>
      <td>{item.cname}</td>
      <td>{item.phonenum}</td>
      <td>{item.createTime && item.createTime.slice(0, 10)}</td>
    </tr>
  );
}

export default function ListAgentAg() {
  // 데이터 ------------------------------------------------------------------------
  // 회원 목록
  const [userList, setUserList] = useState([]);
  // const dispatch = useDispatch();
  // const pageData = useSelector((state) => state.page.pageData, shallowEqual);

  // 회원관리, 상태관리 cid 저장

  return (userList == [] && userList.length == 0) || userList === undefined ? (
    <>
      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="작성" />
      </ul>
      <ComponentErrorNull />
    </>
  ) : (
    <>
      <ComponentListAgentSearch setUserList={setUserList} />

      <ul className="tableTopWrap">
        <LayoutTopButton url={`add`} text="지점 ( 대리점 ) 등록" />
      </ul>

      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th style={{ width: "120px" }}>관리번호</th>
                <th style={{ width: "100px" }}>대표자</th>
                <th style={{ width: "250px" }}>소속총판</th>
                <th style={{ width: "auto" }}>상호명</th>
                <th style={{ width: "150px" }}>휴대폰</th>
                <th style={{ width: "150px" }}>입사일</th>
              </tr>
            </thead>
            <tbody>
              {/* checkbox를 별도로 관리하기 위해 컴포넌트로 관리 */}
              {userList.map((item) => {
                return <ChildTd item={item} key={item.daid} />;
              })}
            </tbody>
          </table>
          <PageButton />
        </div>
      </section>
    </>
  );
}
