import { useState, useEffect, useContext } from "react";
import "./App.css";
import util from "./util";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./home.js";
import Login from "./login.js";
import Register from "./register.js";
import "rsuite/dist/styles/rsuite-default.css";
import store from "./store";
import { UserContext } from "./usercontext";

function App() {
  let [user, setUser] = useState();
  useEffect(async () => {
    let info = await getInfo();
    setUser(info);
  });
  let authed = !!util.getCookie("access_token");

  return (
    <Router>
      <div className="container-fluid">
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
        </Switch>
      </div>
    </Router>
  );

  function PrivateRoute({ component: Component, authed, ...rest }) {
    if (!authed) return (document.location = "/login");
    console.log(user);
    return (
      <UserContext.Provider value={user}>
        <Route {...rest} render={(props) => <Component {...props} />} />
      </UserContext.Provider>
    );
  }
}

async function getInfo() {
  if (!util.getCookie("access_token")) return;
  let info = localStorage.getItem("user_info");
  if (!info) {
    let rs = await store.getInfo(util.getCookie("access_token"));
    if (rs.status === 200) {
      localStorage.setItem("user_info", JSON.stringify(rs.data));
      return JSON.stringify(rs.data);
    }
  }
  return info;
}

function Logout() {
  util.logout();
  return <div></div>;
}

export default App;
