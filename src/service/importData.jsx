import axios from "axios";

function setSession(name, data) {
  localStorage.setItem(name, data);
  // sessionStorage.setItem(name, data);
}
function getSession(name) {
  localStorage.getItem(name);
  // sessionStorage.getItem(name);
}

function axiosGetData(url, getData) {
  return axios(url, {
    method: "GET",
    data: getData,
  })
    .then((res) => res.data)
    .catch((error) => console.log(error));
}

function axiosSetData(url, postData) {
  return axios(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    data: postData,
  })
    .then((res) => res.data)
    .catch((error) => console.log(error));
}

function axiosLogin(loginUrl, userData) {
  return axios({
    method: "POST",
    url: loginUrl,
    data: {
      userid: userData.userid[0],
      passwd: userData.passwd[0],
    },
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.data.status === "fail") {
        alert("회원가입을 먼저 진행해 주세요.");
        return;
      }
      if (res.data.status === "success") {
        const accessToken = res.data.data.jtoken;
        console.log(accessToken);
        setSession("is_login", `${accessToken}`);
        document.location.href = "/";
      }
    })
    .catch((error) => console.log(error.response));
}

export { axiosGetData, axiosSetData, axiosLogin, setSession, getSession };
