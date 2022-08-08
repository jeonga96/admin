import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  axiosPostToken,
  getStorage,
  useDidMountEffect,
} from "../Services/importData";
import { urlGetCompanyDetail, urlGetImages, ISLOGIN } from "../Services/string";

function Company() {
  let { cid } = useParams();
  const [companyDetail, setCompanyDetail] = useState([]);
  const [image, setImage] = useState();
  const reqImgs = useRef(null);
  const token = getStorage(ISLOGIN);

  useEffect(() => {
    axiosPostToken(
      urlGetCompanyDetail,
      {
        rcid: cid,
      },
      token
    ).then((res) => {
      if (res.status === "success") {
        setCompanyDetail(res.data);
        reqImgs.current = res.data.titleImg + "," + res.data.imgs;
        return;
      }
      if (res.status === "fail" && res.emsg === "process failed.") {
        alert("정보가 없습니다. ");
        return;
      }
    });
  }, []);

  useDidMountEffect(() => {
    axiosPostToken(
      urlGetImages,
      {
        imgs: reqImgs.current,
      },
      token
    ).then((res) => {
      console.log(res);
      setImage(res.data);
    });
  }, [companyDetail]);

  // console.log(image[0].storagePath);
  return (
    <div className="mainWrap">
      <section>
        <h3 className="blind">사업자 상세정보 관리</h3>
        <div className="paddingBox commonBox">
          <ul>
            <li className="titleImg">
              {image && (
                <img src={image[0].storagePath} alt="사업자 대표 이미지" />
              )}
            </li>
            <li>{companyDetail.name}</li>
            <li>
              <span>{companyDetail.createTime}</span>
              <span>{companyDetail.updateTime}</span>
            </li>
            <li>{companyDetail.comment}</li>
            <li>{companyDetail.workTime}</li>
            <li>
              <span>{companyDetail.telnum}</span>
              <span>{companyDetail.mobilenum}</span>
              <span>{companyDetail.extnum}</span>
            </li>

            <li>{companyDetail.email}</li>
            <li>{companyDetail.address}</li>
            <li>{companyDetail.offer}</li>
            <li>{companyDetail.registration}</li>

            <li>
              {companyDetail.imgs}
              {image &&
                image.map((item) => (
                  <img
                    key={item.iid}
                    src={item.storagePath}
                    alt="사업자 상세 이미지"
                  />
                ))}
            </li>
            <li>{companyDetail.keywords}</li>
            <li>{companyDetail.longitude}</li>
            <li>{companyDetail.latitude}</li>
          </ul>
          <div className="bigButton widthCenter">
            <Link className="Link" to="setcompanydetailInfo">
              사업자 정보 수정
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Company;
