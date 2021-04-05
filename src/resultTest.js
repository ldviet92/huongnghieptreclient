import { useEffect, useState } from "react";
import { Alert, Loader, Placeholder } from "rsuite";
import store from "./store";
import { Progress } from "rsuite";
import util from "./util";
import errors from "./errors";
import { find } from "lodash";

const { Line } = Progress;

export default function ResultTest(props) {
  let { steps } = props;
  let [points, setPoints] = useState();
  let [lines, setLines] = useState([]);
  let [perstypes, setPerstypes] = useState();
  useEffect(() => {
    fetchData();
  }, []);

  let fetchData = async () => {
    let [pt, errpt] = await fetchPerstypes();
    if (errpt) return Alert.error(errpt);
    if (!pt) pt = [];
    setPerstypes(pt);

    let [p, err] = await fetchPoints();
    if (err) return Alert.error(err);
    if (!p) p = [];
    setPoints(p);
    let lines = [];
    console.log(p);
    for (let i = 0; i < p.length; i++) {
      let point = p[i].Point;
      let percent = parseInt((point / 33) * 100);
      let color = "";
      if (point >= 16) {
        color = "#58b15b";
      } else if (point >= 5 && point <= 15) {
        color = "#ffc108";
      } else {
        color = "#94928e";
      }
      let perstype = find(pt, ["Id", p[i].PerstypeId]);
      lines.push(
        <div className="col-12" key={i}>
          <div className="row no-gutters">
            <div className="col-2">
              <span>
                {perstype.Name} {point}
              </span>
            </div>
            <div className="col-10">
              <Line percent={percent} strokeColor={color} showInfo={false} />
            </div>
          </div>
        </div>
      );
    }
    setLines(lines);
  };

  return <div className="mt-5">{lines}</div>;
}

async function fetchPerstypes() {
  let [rs, err] = await store.listPerstype();
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  let data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}

async function fetchPoints() {
  let [rs, err] = await store.listUserPoint(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  let data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}
