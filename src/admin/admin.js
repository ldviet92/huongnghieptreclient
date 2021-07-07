import { useState, useEffect } from "react";
import Menu from "./menu.js";
import store from "./../store.js";
import util from "./../util";
import { Alert } from "rsuite";
import errors from "./../errors";
import { orderBy } from "lodash";

export default function Admin(props) {
  let [users, setUsers] = useState();
  let [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    let [ad, errA] = await adminAuth();
    if(errA) return Alert.error(errA)
    if (ad) {
      setIsAdmin(true);
    }

    let [u, err] = await fetchUsers();
    if (err) return Alert.error(err);
    u = orderBy(u, "CreatedAt", "desc");
    setUsers(u);
  }

  if (!isAdmin) {
    return <div>Bạn không có quyền truy cập vào trang này</div>;
  }

  return (
    <div>
      <Menu />
      <h1>Danh sách người đăng kí dùng</h1>
      <table className="table table-bordered mt-5">
        <thead>
          <tr className="text-center font-weight-bold">
            <th>Tên</th>
            <th>Email</th>
            <th>Sdt</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>{userRender(users)}</tbody>
      </table>
    </div>
  );
}

let userRender = (users) => {
  if (!users) return;
  let u = users.map((item) => {
    return (
      <tr key={item.Id}>
        <td>{item.Fullname}</td>
        <td>{item.Email}</td>
        <td>{item.Phone}</td>
        <td>{item.Status}</td>
        <td>{convertTime(item.CreatedAt)}</td>
      </tr>
    );
  });
  return u;
};

function convertTime(t) {
  let dt = new Date(t);
  return `${dt.getDate()}/${dt.getMonth()}/${dt.getFullYear()}`;
}

async function adminAuth() {
  let [rs, err] = await store.adminAuth(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  return [rs, undefined];
}

async function fetchUsers() {
  let [rs, err] = await store.listUser(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  let data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}
