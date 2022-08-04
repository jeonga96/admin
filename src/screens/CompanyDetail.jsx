import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosPostToken, getStorage } from "../Services/importData";
import { urlCompanylist, ISLOGIN } from "../Services/string";

function Company() {
  const [companyList, setCompanyList] = useState([]);
  const [listPage, setListPage] = useState({});

  const { id } = useParams();
  console.log(id);

  return (
    <div className="mainWrap">
      <div className="tableTopWrap">
        <div className="smallButton">
          <Link className="smallButtonLink Link" to="/addcompany">
            사업자 추가
          </Link>
        </div>
      </div>
      <section className="tableWrap"></section>
    </div>
  );
}
export default Company;
