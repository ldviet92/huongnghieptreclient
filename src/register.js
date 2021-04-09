import { useState } from "react";
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
  fullname: StringType().isRequired("Vui lòng nhập họ tên"),
  email: StringType()
    .isEmail("Vui lòng điền đúng địa chỉ email")
    .isRequired("Vui lòng nhập email"),
  phone: StringType()
    .isRequired("Vui lòng nhập số điện thoại")
    .maxLength(10, "Số điện thoại chưa chính xác")
    .minLength(10, "Số điện thoại chưa chính xác"),
  password: StringType().isRequired("Vui lòng nhập mật khẩu"),
  // .containsUppercaseLetter("Mật khẩu phải có chữ hoa")
  // .containsNumber("Mật khảu phải có số"),
});
export default function Register() {
  return (
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-column p-4 bg-white mt-5 shadow rounded">
        <span className="h3 text-center">Đăng Ký</span>
        <CheckForm />
      </div>
    </div>
  );
}
function TextField(props) {
  const { name, label, accepter, type, ...rest } = props;
  return (
    <FormGroup>
      <ControlLabel>{label} </ControlLabel>
      <FormControl name={name} accepter={accepter} {...rest} type={type} />
    </FormGroup>
  );
}
function CheckForm() {
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();
  let [phone, setPhone] = useState();
  let [fullname, setFullname] = useState();
  let [isLoading, setIsLoading] = useState(false);
  let [error, setError] = useState();
  return (
    <Form model={model}>
      <TextField
        name="email"
        label="Email"
        value={email}
        onChange={(val) => setEmail(val)}
      />
      <TextField
        name="password"
        label="Mật khẩu"
        type="password"
        value={password}
        onChange={(val) => setPassword(val)}
      />
      <TextField
        name="fullname"
        label="Họ tên"
        value={fullname}
        onChange={(val) => setFullname(val)}
      />
      <TextField
        name="phone"
        label="Số điện thoại"
        value={phone}
        onChange={(val) => setPhone(val)}
      />
      <label className="text-danger small">{error}</label>
      <div className="text-center">
        <Button
          appearance="primary"
          type="submit"
          color="red"
          onClick={() => onRegister(email, password, phone, fullname)}
          loading={isLoading}
        >
          Đăng Ký
        </Button>
      </div>
      <div className="text-right small">
        <a href="/login">Đăng Nhập</a>
      </div>
    </Form>
  );

  async function onRegister() {
    setIsLoading(true);
    let [rs, err] = await store.register(email, password, phone, fullname);
    if (err != undefined) {
      setIsLoading(false);
      console.log(err);
      setError(err.toString());
      return;
    }
    if (rs != undefined && rs.status === 200) {
      window.location = "/login";
    } else {
      setError(rs.error);
    }
    setIsLoading(false);
  }
}
