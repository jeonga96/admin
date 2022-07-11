import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import Tr from "../common/TabelTr";

function Revenue() {
  const [data, setData] = useState([]);
  const urlData = "./data/table.json";
  const axiosData = async () => {
    const jsonData = await axios.get(urlData);
    setData(jsonData.data);
  };
  useEffect(() => {
    axiosData();
  }, []);

  const filterData = data.filter((item) => item.id <= 10);
  return (
    <section className="revenue">
      <div className="revenueSaleBox commonBox">
        <div className="tableScroll">
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
          <Link to="table" className="link tabelLink">
            <span>More view</span>
            <i>
              <BsArrowRightShort />
            </i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Revenue;
