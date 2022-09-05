import SetCompany from "../components/common/SetCompany";
import {
  urlGetCompanyMyDetail,
  urlSetCompanyMyDetail,
} from "../Services/string";

function SetCompanyMyDetail() {
  const cid = 44;
  return (
    <div className="mainWrap formCommonWrap">
      <div className="commonBox formBox">
        <SetCompany
          cid={cid}
          getAPI={urlGetCompanyMyDetail}
          setAPI={urlSetCompanyMyDetail}
        />
      </div>
    </div>
  );
}
export default SetCompanyMyDetail;
