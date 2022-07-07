import Sales from "../../pages/Sales";

function Container({ content }) {
  return (
    <div className="containerWrap">
      <h2 className="blind">현재 페이지 내용</h2>
      <div className="contentBox">
        <div className="contentTitleWrap">
          <div className="ContainertitleText">
            <h3>Dashboard</h3>
            <ol className="ContainerTitlebreadcrumb">
              <li className="breadcrumbPrev">
                <span>Salessa</span>
              </li>
              <li className="breadcrumbPrev">
                <span>Dashboard</span>
              </li>
              <li>
                <span>Sales</span>
              </li>
            </ol>
          </div>
          <button type="button" className="containerTitleBtn">
            Create Report
          </button>
        </div>
        <Sales />
      </div>
    </div>
  );
}
export default Container;
