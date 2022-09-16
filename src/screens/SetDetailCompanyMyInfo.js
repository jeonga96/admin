import SetCompany from "../components/common/SetCompany";
import {
  urlGetCompanyMyDetail,
  urlSetCompanyMyDetail,
} from "../Services/string";

export default function SetDetailCompanyMyInfo() {
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
