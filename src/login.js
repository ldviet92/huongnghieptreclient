import React, { useState } from "react";
import util from "./util";
import {
  Schema,
  FormGroup,
  ControlLabel,
  FormControl,
  Form,
  Button,
} from "rsuite";
import store from "./store";
const { StringType } = Schema.Types;
const model = Schema.Model({
  email: StringType().isRequired("Vui lòng nhập email"),
  password: StringType().isRequired("Vui lòng nhập mật khẩu"),
});
export default function Login() {
  if (util.getCookie("access_token")) window.location = "/";
  return (
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-column p-4 bg-white mt-5 shadow rounded">
        <span className="h3 text-center">Đăng nhập</span>
        <CheckForm />
      </div>
    </div>
  );
}
function TextField(props) {
  const { name, label, accepter, type, value, ...rest } = props;
  return (
    <FormGroup>
      <ControlLabel>{label} </ControlLabel>
      <FormControl
        name={name}
        accepter={accepter}
        value={value}
        {...rest}
        type={type}
      />
    </FormGroup>
  );
}
function CheckForm() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  return (
    <Form model={model}>
      <TextField
        name="email"
        label="Email"
        value={email}
        onChange={(value) => setEmail(value)}
      />
      <TextField
        name="password"
        label="Mật khẩu "
        value={password}
        type="password"
        onChange={(value) => setPassword(value)}
      />
      <label className="text-danger small">{error}</label>
      <div className="text-center">
        <Button
          appearance="primary"
          type="submit"
          onClick={() => onLogin(email, password)}
          loading={isLoading}
          color="red"
        >
          Đăng Nhập
        </Button>
      </div>
      <div className="text-right small">
        <a href="/register">Đăng Ký</a>
      </div>
    </Form>
  );
  async function onLogin(email, password) {
    setIsLoading(true);
    let rs = await store.login(email, password);
    if (rs.status === 200) {
      let token = rs.data.token;
      util.setCookie("access_token", 30);
      document.cookie = "access_token=" + token;
      window.location = "/";
    } else {
      setError(rs.error);
    }
    setIsLoading(false);
  }
}
