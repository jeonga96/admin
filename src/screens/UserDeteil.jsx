import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { urlUserDetail, ISLOGIN } from "../Services/string";
import {
  axiosPostToken,
  axiosGetToken,
  getStorage,
} from "../Services/importData";

function UserDeteil() {
  const token = getStorage(ISLOGIN);
  // const getData = axiosPostToken(urlUserDetail, {}, token);
  // useEffect(() => {
  //   getData();
  //   console.log(getData);
  // }, []);

  return (
    <div className="mainWrap">
      <div className="addButton">
        <Link className="addButtonLink" to="/company/addcompany">
          관리자 상세정보
        </Link>
      </div>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="tableBox commonBox"></div>
      </section>
    </div>
  );
}
export default UserDeteil;
