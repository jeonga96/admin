// import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { axiosGetData } from "../service/axios";
import { tableUrl } from "../service/url";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import Tr from "../components/common/TabelTr";

function LoginPages() {
  const [data, setData] = useState([]);
  function axiosData() {
    axiosGetData(tableUrl).then((res) => setData(res));
  }
  useEffect(() => {
    axiosData();
  }, []);
  const filterData = data.filter((item) => item.id <= 10);
  const buttonArr = [];
  const buttonIf =
    data.length % 10 === 0 ? data.length / 10 : data.length / 10 + 1;
  const buttonData = (index) => {
    let i = 1;
    for (i; i <= index; i++) {
      buttonArr.push(i);
    }
  };
  buttonData(buttonIf);
  return (
    <section className="mainWrap tableWrap">
      <h3 className="blind">table</h3>
      <div className="tableBox commonBox">
        <table className="commonTable">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>별도파일</th>
              <th>작성날짜</th>
            </tr>
          </thead>
          <tbody className="revenueSaleTbody">
            {filterData.map((item) => (
              <Tr key={item.id} item={item} />
            ))}
          </tbody>
        </table>
        <ul className="tableBtn">
          <li>
            <button type="button">
              <i>
                <HiOutlineChevronDoubleLeft />
              </i>
              <span className="blind">맨 앞으로 가기</span>
            </button>
          </li>
          {buttonArr.map((item, key) => (
            <li key={key}>
              <button type="button">{item}</button>
              <span className="blind">{item}페이지로 가기</span>
            </li>
          ))}
          <li>
            <button type="button">
              <i>
                <HiOutlineChevronDoubleRight />
              </i>
              <span className="blind">맨 뒤로 가기</span>
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
}
export default LoginPages;
