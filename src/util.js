function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

let addParams = (root, params) => {
  let url = new URL(root);
  for (let key in params) {
    url.searchParams.append(key, params[key]);
  }
  return url;
};

let logout = () => {
  setCookie("access_token", "", -1000);
  localStorage.removeItem("user_info");
  document.location = "/login";
};

module.exports = {
  getCookie,
  setCookie,
  addParams,
  logout,
};
