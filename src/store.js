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
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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
    )
      .then((rs) => {
        console.log(rs); // JSON data parsed by `data.json()` call
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async register(email, password, phone, fullname) {
    let result = await this.POST(
      "register",
      {},
      {
        email: email,
        password: password,
        phone: phone,
        fullname: fullname,
      }
    )
      .then((rs) => {
        console.log(rs); // JSON data parsed by `data.json()` call
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async getInfo(access_token) {
    let result = await this.GET("user/info", {
      access_token: access_token,
    })
      .then((rs) => {
        console.log(rs);
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async getStep(access_token) {
    let result = await this.GET("steps", {
      access_token: access_token,
    })
      .then((rs) => {
        console.log(rs);
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async getUserStep(access_token) {
    let result = await this.GET("users/steps", {
      access_token: access_token,
    })
      .then((rs) => {
        console.log(rs);
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async updateUserStep(access_token, stepId, testId) {
    let result = await this.POST(
      "users/steps",
      {
        access_token: access_token,
      },
      {
        step_id: stepId,
        test_id: testId,
      }
    )
      .then((rs) => {
        console.log(rs); // JSON data parsed by `data.json()` call
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async getTest(access_token) {
    let result = await this.GET("tests", {
      access_token: access_token,
    })
      .then((rs) => {
        console.log(rs);
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async getQuestions(access_token) {
    let result = await this.GET("questions", {
      access_token: access_token,
    })
      .then((rs) => {
        console.log(rs);
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async listUserQuestions(access_token) {
    let result = await this.GET("users/questions", {
      access_token: access_token,
    })
      .then((rs) => {
        console.log(rs);
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async calculatorPoint(access_token) {
    let result = await this.GET("users/calculator", {
      access_token: access_token,
    })
      .then((rs) => {
        console.log(rs);
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async listUserPoint(access_token) {
    let result = await this.GET("users/points", {
      access_token: access_token,
    })
      .then((rs) => {
        console.log(rs);
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async listPerstype() {
    let result = await this.GET("perstionaltypes")
      .then((rs) => {
        console.log(rs);
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }

  async postResult(access_token, resultQuestion) {
    let result = await this.POST(
      "questions",
      {
        access_token: access_token,
      },
      {
        result: resultQuestion,
      }
    )
      .then((rs) => {
        console.log(rs); // JSON data parsed by `data.json()` call
        return [rs, undefined];
      })
      .catch((err) => {
        console.log("err", err);
        return [undefined, JSON.stringify(err)];
      });
    return result;
  }
}

export default new Store();
