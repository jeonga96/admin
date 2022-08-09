/*global kakao*/

import { useEffect } from "react";

function Map({ companyDetail }) {
  useEffect(() => {
    var container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
    var options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3,
    };

    var map = new kakao.maps.Map(container, options);

    var geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(companyDetail.address, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        var marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });
        map.setCenter(coords);
      }
    });
  }, [companyDetail]);

  return <div id="map"></div>;
}
export default Map;
