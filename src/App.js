import { useState, useEffect } from "react";
import "./App.css";
import util from "./util";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./home.js";
import Login from "./login.js";
import Register from "./register.js";
import Admin from "./admin/admin.js";
import "rsuite/dist/styles/rsuite-default.css";
import store from "./store";
import { UserContext } from "./usercontext";
import { Alert } from "rsuite";
import errors from "./errors";

function App() {
  let [user, setUser] = useState();
  let [uStep, setUStep] = useState();
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    if (!util.getCookie("access_token")) return;
    let [u, err] = await getInfo();
    if (err) return Alert.error(err);
    setUser(u);

    let [us, errus] = await getUserStep();
    if (errus) return Alert.error(errus);
    setUStep(us);
  }
  let authed = !!util.getCookie("access_token");

  return (
    <Router>
      <div className="container">
        <Switch>
          <PrivateRoute exact path="/" authed={authed}>
            <Home />
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <PrivateRoute path="/admin" authed={authed}>
            <Admin />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );

  function PrivateRoute({ component: Component, authed, ...rest }) {
    if (!authed) return (document.location = "/login");
    return (
      <UserContext.Provider value={[user, uStep]}>
        <Route {...rest} render={(props) => <Component {...props} />} />
      </UserContext.Provider>
    );
  }

  async function getInfo() {
    if (!util.getCookie("access_token")) return;
    let info = localStorage.getItem("user_info");
    if (info) return [info, undefined];
    let [rs, err] = await store.getInfo(util.getCookie("access_token"));
    if (err) return [undefined, errors.CONNECT_ERROR];
    if (rs.status !== 200) return [undefined, rs.error];

    return [JSON.stringify(rs.data), undefined];
  }

  async function getUserStep() {
    if (!util.getCookie("access_token")) return;
    let [rs, err] = await store.getUserStep(util.getCookie("access_token"));
    if (err) return [undefined, errors.CONNECT_ERROR];
    if (rs.status !== 200) return [undefined, rs.error];
    if (rs.data == null) return [undefined, undefined];
    return [JSON.stringify(rs.data), undefined];
  }
}

function Logout() {
  util.logout();
  return <div></div>;
}

export default App;
