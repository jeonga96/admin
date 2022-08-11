/*global kakao*/

import { useEffect } from "react";

function Map({ companyDetail }) {
  useEffect(() => {
    var geocoder = new kakao.maps.services.Geocoder();
    var callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        console.log("위도", result[0].x * 100000, "경도", result[0].y * 100000);
      }
    };
    geocoder.addressSearch(companyDetail.address, callback);
    console.log(geocoder);
  }, []);
  return <div id="map"></div>;
}
export default Map;
