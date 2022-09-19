import { useParams } from "react-router-dom";
import SetCompany from "../components/common/SetCompany";
import { urlSetCompanyDetail, urlGetCompanyDetail } from "../Services/string";

export default function SetCompanyDetail() {
  const { cid } = useParams();

  return (
    <>
      <div className="commonBox formBox">
        <SetCompany
          cid={cid}
          getAPI={urlGetCompanyDetail}
          setAPI={urlSetCompanyDetail}
        />
      </div>
    </>
  );
}
