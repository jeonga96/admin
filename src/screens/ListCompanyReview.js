import { Link, useParams } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { servicesPostData } from "../Services/importData";
import { urlReviewList } from "../Services/string";
import { MdOutlineImage } from "react-icons/md";

import ErrorNullBox from "../components/common/ErrorNullBox";

export default function ListCompanyReview() {
  let { cid } = useParams();
  const [review, setReview] = useState([]);

  useLayoutEffect(() => {
    servicesPostData(urlReviewList, {
      rcid: cid,
    }).then((res) => {
      setReview(res.data);
    });
  }, []);

  return review === undefined ? (
    <ErrorNullBox />
  ) : (
    <>
      <section className="tableWrap">
        <h3 className="blind">table</h3>
        <div className="paddingBox commonBox">
          <table className="commonTable">
            <thead>
              <tr>
                <th className="widthM">번호</th>
                <th className="widthM">별명</th>
                <th className="widthBB">내용</th>
                <th className="widthM">날짜</th>
              </tr>
            </thead>
            <tbody className="commonTable">
              {review &&
                review.map((item) => (
                  <tr key={item.comrid} style={{ height: "5.25rem" }}>
                    <td>{item.comrid}</td>
                    <td>{item.ruidNick}</td>
                    <td className="tableContentWrap">
                      <Link
                        to={`/company/${item.rcid}/review/${item.comrid}`}
                        className="Link"
                      >
                        <em>{item.title}</em>
                        <i>{item.imgs ? <MdOutlineImage /> : null}</i>
                        <p>
                          {item.content.length > 55
                            ? item.content.slice(0, 54) + "..."
                            : item.content}
                        </p>
                      </Link>
                    </td>
                    <td>{item.createTime.slice(0, 10)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
