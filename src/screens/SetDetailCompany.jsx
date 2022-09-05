import { useParams } from "react-router-dom";
import SetCompany from "../components/common/SetCompany";
import { urlSetCompanyDetail, urlGetCompanyDetail } from "../Services/string";

function SetCompanyDetail() {
  const { cid } = useParams();

  return (
    <div className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <SetCompany
          cid={cid}
          getAPI={urlGetCompanyDetail}
          setAPI={urlSetCompanyDetail}
        />
      </div>
    </div>
  );
}
export default SetCompanyDetail;
