import { useState, useEffect } from "react";
import store from "./../store.js";
import { Alert, Drawer, Icon, TagPicker } from "rsuite";
import util from "./../util";
import Menu from "./menu.js";
import Select from "react-select";
import {get} from 'lodash';

export default function Career(props) {
  let [careerGroups, setCareerGroups] = useState([]);
  let [careers, setCareers] = useState([]);
  let [objCg, setObjCg] = useState({});

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchCareerGroup();
      fetchCareer();
    }
    return () => (isMounted = false);
  }, []);

  async function fetchCareerGroup() {
    let [rs, err] = await store.listCareerGroup(util.getCookie("access_token"));
    if (err) return Alert.error(err);
    setCareerGroups(rs.data);
    let objcg = rs.data.reduce((obj, cur, i) => {
      obj[cur.Id] = cur;
      return obj;
    }, {});
    setObjCg(objcg);
  }

  async function fetchCareer() {
    let [rs, err] = await store.listCareer(util.getCookie("access_token"));
    if (err) return Alert.error(err);
    setCareers(rs.data);
  }

  async function upsertCareer(data) {
    if (data.Id == "") {
      let [rs, err] = await store.createCareer(
        util.getCookie("access_token"),
        data
      );
      if (err) return Alert.error(err);
    } else {
      let [rs, err] = await store.updateCareer(
        util.getCookie("access_token"),
        data
      );
      if (err) return Alert.error(err);
    }

    fetchCareer();
  }

  let cag = (cgIds) => {
    let ids = cgIds.split(",")
    let val =  ids.map((id) => get(objCg[id],'Name'));
    return val.toString()
  };

  let careerRows = () => {
    return careers.map((c, i) => (
      <tr key={c.Id}>
        <td>{i + 1}</td>
        <td>{c.Name}</td>
        <td>{c.Code}</td>
        <td>{c.Status}</td>
        <td>{cag(c.CareerGroupIds)}</td>
        <td>
          <EditCareer
            career={c}
            upsertCareer={(data) => upsertCareer(data)}
            careerGroups={careerGroups}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <Menu />
      <div className="mt-5">
        <h4>Công việc</h4>
        <div>
          <EditCareer
            upsertCareer={(data) => upsertCareer(data)}
            careerGroups={careerGroups}
          />
        </div>
        <table className="table mt-2">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Mã</th>
              <th>Trạng thái</th>
              <th>Nhóm ngành</th>
              <th>Sửa</th>
            </tr>
          </thead>
          <tbody>{careerRows()}</tbody>
        </table>
      </div>
    </div>
  );
}

let EditCareer = (props) => {
  let [show, setShow] = useState(false);
  let [name, setName] = useState("");
  let [code, setCode] = useState("");
  let [id, setId] = useState("");
  let [careerGroupIds, setCareerGroupIds] = useState([]);
  let [status, setStatus] = useState("active");
  let [cgt, setCgt] = useState([]);
  let cgs = props.careerGroups.map((cg) => {
    cg.label = cg.Name;
    cg.value = cg.Id;
    return cg;
  });

  let onSubmit = () => {
    let cgIds = cgt.map((val) => {
      return val.Id;
    });

    props.upsertCareer({
      Id: id,
      Code: code,
      Name: name,
      CareerGroupIds: cgIds.toString(),
      Status: status,
    });
    setShow(false);
  };

  useEffect(() => {
    if (props.career) {
      setId(props.career.Id);
      setName(props.career.Name);
      setCode(props.career.Code);
      setCareerGroupIds(props.career.CareerGroupIds);
      setStatus(props.career.Status);
      let cgIds = props.career.CareerGroupIds.split(",");

      let objcg = props.careerGroups.reduce((obj, cur, i) => {
        obj[cur.Id] = cur;
        return obj;
      }, {});


      let tmp = cgIds.map((id) => {
        if (objcg[id]) {
          objcg[id].value = objcg[id].Id;
          objcg[id].label = objcg[id].Name;
          return objcg[id];
        }
      });
      setCgt(tmp);
    }
  }, []);

  let showButton = () => {
    if (!props.career || props.career.Id == "") {
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
            <Select
              defaultValue={cgt}
              isMulti
              options={cgs}
              onChange={(e) => setCgt(e)}
            />
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
