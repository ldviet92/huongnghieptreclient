import {
  Schema,
  FormGroup,
  ControlLabel,
  FormControl,
  Form,
  Button,
} from "rsuite";

const { StringType, NumberType } = Schema.Types;
const model = Schema.Model({
  fullname: StringType().isRequired("Vui lòng nhập họ tên"),
  email: StringType()
    .isEmail("Vui lòng điền đúng địa chỉ email")
    .isRequired("Vui lòng nhập email"),
  phone: StringType()
    .isRequired("Vui lòng nhập số điện thoại")
    .maxLength(10, "Số điện thoại chưa chính xác")
    .minLength(10, "Số điện thoại chưa chính xác"),
  password: StringType()
    .isRequired("Vui lòng nhập mật khẩu")
    .containsUppercaseLetter("Mật khẩu phải có chữ hoa")
    .containsNumber("Mật khảu phải có số"),
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
  return (
    <Form model={model}>
      <TextField name="fullname" label="Họ tên" />
      <TextField name="email" label="Email" />
      <TextField name="password" label="Mật khẩu" type="password" />
      <TextField name="phone" label="Số điện thoại" />
      <div className="text-center">
        <Button appearance="primary" type="submit" color="red">
          Đăng Ký
        </Button>
      </div>
      <div className="text-right small">
        <a href="/login">Đăng Nhập</a>
      </div>
    </Form>
  );
}
