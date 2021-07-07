import { useState, useEffect } from "react";
import store from "./../store.js";
import { Alert, Drawer, Icon } from "rsuite";
import util from "./../util";
import Menu from "./menu.js";

export default function CareerGroup(props) {
  let [perstypes, setPerstypes] = useState([]);
  let [careerGroups, setCareerGroups] = useState([]);
  let [objPt, setObjPt] = useState({});

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchCareerGroup();
      fetchPerstype();
    }
    return () => (isMounted = false);
  }, []);

  async function fetchPerstype() {
    let [rs, err] = await store.listPerstype();
    if (err) return Alert.error();
    setPerstypes(rs.data);
    let result = rs.data.reduce((obj, cur, i) => {
      obj[cur.Id] = cur;
      return obj;
    }, {});
    setObjPt(result);
  }

  async function fetchCareerGroup() {
    let [rs, err] = await store.listCareerGroup(util.getCookie("access_token"));
    if (err) return Alert.error(err);
    setCareerGroups(rs.data);
  }

  async function upsertCareerGroup(data) {
    if (data.Id == "") {
      let [rs, err] = await store.createCareerGroup(
        util.getCookie("access_token"),
        data
      );
      if (err) return Alert.error(err);
    } else {
      let [rs, err] = await store.updateCareerGroup(
        util.getCookie("access_token"),
        data
      );
      if (err) return Alert.error(err);
    }

    fetchCareerGroup();
  }

  let CareerGroupRows = () => {
    return careerGroups.map((cg, i) => (
      <tr key={cg.Id}>
        <td>{i + 1}</td>
        <td>{cg.Name}</td>
        <td>{cg.Code}</td>
        <td>{objPt[cg.PerstypeId] ? objPt[cg.PerstypeId].Name : ""}</td>
        <td>{cg.Status}</td>
        <td>
          <EditCareerGroup
            careerGroup={cg}
            perstypes={perstypes}
            upsertCareerGroup={(data) => upsertCareerGroup(data)}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <Menu />
      <h1>Danh sách nhóm ngành</h1>
      <div className="mt-5">
        <EditCareerGroup
          perstypes={perstypes}
          upsertCareerGroup={(data) => upsertCareerGroup(data)}
        />
        <table className="table mt-1">
          <thead>
            <tr>
               <th>STT</th> 
              <th>Tên ngành</th>
              <th>Mã</th>
              <th>Nhóm ngành cấp 1</th>
              <th>Status</th>
              <th>Edit</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <CareerGroupRows />
          </tbody>
        </table>
      </div>
    </div>
  );
}

let EditCareerGroup = (props) => {
  let [show, setShow] = useState(false);
  let [name, setName] = useState("");
  let [code, setCode] = useState("");
  let [id, setId] = useState("");
  let [perstypeId, setPerstypeId] = useState("");
  let [status, setStatus] = useState("");

  useEffect(() => {
    if (props.careerGroup) {
      setId(props.careerGroup.Id);
      setName(props.careerGroup.Name);
      setCode(props.careerGroup.Code);
      setPerstypeId(props.careerGroup.PerstypeId);
      setStatus(props.careerGroup.Status);
    }
  }, []);

  let onSubmit = () => {
    props.upsertCareerGroup({
      Id: id,
      Code: code,
      Name: name,
      PerstypeId: perstypeId,
      Status: status,
    });
    setShow(false);
  };

  let showButton = () => {
    if (!props.careerGroup || props.careerGroup.Id == "") {
      return (
        <button className="btn btn-success" onClick={() => setShow(true)}>
          Thêm
        </button>
      );
    }

    return <Icon icon="edit" onClick={() => setShow(true)} />;
  };

  return (
    <div className="">
      <div className="d-flex justify-content-end">{showButton()}</div>
      <Drawer full show={show} onHide={() => setShow(false)}>
        <Drawer.Header>
          <Drawer.Title>Drawer Title</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="form-group">
            <label>Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Mã</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Nhóm Ngành</label>
            <select
              value={perstypeId}
              className="form-control"
              onChange={(e) => setPerstypeId(e.target.value)}
            >
              <option></option>
              {perstypeOptions(props.perstypes)}
            </select>
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <button className="btn btn-success" onClick={() => onSubmit()}>
            Confirm
          </button>
          <button onClick={() => setShow(false)} className="btn">
            Cancel
          </button>
        </Drawer.Footer>
      </Drawer>
    </div>
  );
};

let perstypeOptions = (perstypes) => {
  return perstypes.map((perstype) => (
    <option key={perstype.Id} value={perstype.Id}>
      {perstype.Name}
    </option>
  ));
};
