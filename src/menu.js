import { useContext } from "react";
import { Navbar, Icon, Nav, Dropdown } from "rsuite";
import logo from "./asset/images/huongnghieptre_logo.png";
import { UserContext } from "./usercontext";
import util from "./util";
export default function Menu() {
  let [userstr, stepstr] = useContext(UserContext);
  let user = userstr ? JSON.parse(userstr) : {};
  return (
    <Navbar>
      <Navbar.Header>
        <a href="/" className="navbar-brand logo">
          <img src={logo} className="p-2" style={{ height: "40px" }} />
        </a>
      </Navbar.Header>
      <Navbar.Body>
        <Nav>
          <Nav.Item href="/" icon={<Icon icon="home" />}>
            Home
          </Nav.Item>
          {/* <Nav.Item href="/register">Register</Nav.Item> */}
          {/* <Nav.Item>Products</Nav.Item> */}
        </Nav>
        <Nav pullRight>
          <Dropdown icon={<Icon icon="user" />} placement="bottomEnd">
            <Dropdown.Item>{user["email"]}</Dropdown.Item>
            <Dropdown.Item onClick={() => util.logout()}>Logout</Dropdown.Item>
          </Dropdown>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
}
