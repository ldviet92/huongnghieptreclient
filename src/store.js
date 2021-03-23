import config from "./config";
import util from "./util";
class Store {
  async GET(path = "", params = {}) {
    let url = util.addParams(config.ApiHost + path, params);
    // Default options are marked with *
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      //   body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async POST(path = "", params = {}, data = {}) {
    // Default options are marked with *
    let url = util.addParams(config.ApiHost + path, params);
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async login(email, password) {
    let result = await this.POST(
      "login",
      {},
      {
        email: email,
        password: password,
      }
    ).then((rs) => {
      console.log(rs); // JSON data parsed by `data.json()` call
      return rs;
    });
    return result;
  }

  async getInfo(access_token) {
    let result = await this.GET("user/info", {
      access_token: access_token,
    }).then((rs) => {
      console.log(rs);
      return rs;
    });
    return result;
  }
}

export default new Store();
