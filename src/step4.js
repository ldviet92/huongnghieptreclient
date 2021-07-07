import React, { useState, useEffect } from "react";
import { Button, Loader, Placeholder, Checkbox } from "rsuite";
import { keyBy, groupBy, orderBy, filter, map, get } from "lodash";

const { Paragraph } = Placeholder;
export default function Step4(props) {
  const { careers, perstypes, points, careerGroups } = props;
  const perstypeObj = keyBy(perstypes, "Id");
  const [cgPicked, setCgPicked] = useState({});

  useEffect(() => {}, []);

  if (!careers || !perstypes || !points) {
    return (
      <div>
        {" "}
        <Paragraph rows={8}>
          <Loader center content="loading" />
        </Paragraph>
      </div>
    );
  }

  const pointsSort = orderBy(points, "Point", "desc");
  const pointsProspecting = filter(pointsSort, (item) => item.Point >= 16);
  const pointsPromising = filter(
    pointsSort,
    (item) => item.Point > 5 && item.Point <= 15
  );
  const pointsChallenging = filter(pointsSort, (item) => item.Point <= 5);
  const cgObj = keyBy(careerGroups, "Id");

  const renderCareers = () => {
    let listCg = (cgIds) => {
      let l = map(cgIds.split(","), (id) =>  cgObj[id].Name);
      return l.toString();
    };

    let cs = [];
    for (let cgId in cgPicked) {
      for (let i = 0; i < careers.length; i++) {
        let c = careers[i];
        if (c.CareerGroupIds.includes(cgId)) {
          cs.push(
            <tr key={c.Id}>
              <td>{c.Name}</td>
              <td>{listCg(c.CareerGroupIds)}</td>
            </tr>
          );
        }
      }
    }
    return cs;
  };

  const onChangeCg = (cgId, isChecked) => {
    let tmpCg = Object.assign({}, cgPicked);
    if (isChecked) {
      tmpCg[cgId] = true;
    }else{
      delete tmpCg[cgId]
    }

    setCgPicked(tmpCg);
  };

  const perstypeJobs = (points, perstypesObj) => {
    let cgRow = (ptId) => {
      return map(props.careerGroups, (cg) => {
        if (cg.PerstypeId == ptId) {
          return (
            <Checkbox
              key={cg.Id}
              value={cg.Id}
              onChange={(e, isChecked) => onChangeCg(e, isChecked)}
            >
              {cg.Name}
            </Checkbox>
          );
        }
      });
    };
    let rs = map(points, (p) => {
      return (
        <div key={perstypeObj[p.PerstypeId].Id}>
          <h6>{perstypeObj[p.PerstypeId].Name}</h6>
          <div>{cgRow(p.PerstypeId)}</div>
        </div>
      );
    });
    return rs;
  };

  return (
    <div className="row mt-5">
      <div className="col-md-3">
        <div className="card ">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <h5 className="card-title">Triển vọng</h5>
              {perstypeJobs(pointsProspecting, perstypeObj)}
            </li>
            <li className="list-group-item">
              <h5 className="card-title">Hứa hẹn</h5>
              {perstypeJobs(pointsPromising, perstypeObj)}
            </li>
            <li className="list-group-item">
              <h5 className="card-title">Thử thách</h5>
              {perstypeJobs(pointsChallenging, perstypeObj)}
            </li>
          </ul>
        </div>
      </div>
      <div className="col-md-9">
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th className="" scope="col">
                  Nghề
                </th>
                <th className="" scope="col">
                  Nhóm nghề
                </th>
              </tr>
            </thead>
            <tbody>{renderCareers()}</tbody>
          </table>
        </div>
      </div>
      <div className="col-12 text-center mt-5">
        <Button onClick={props.onBackStep} appearance="primary">
          Quay lại
        </Button>
      </div>
    </div>
  );
}
