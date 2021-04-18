import { find, map, orderBy } from "lodash";
import { Progress, Button } from "rsuite";
import parse from "html-react-parser";
const { Line } = Progress;

export default function Step3(props) {
  let { perstypes, points } = props;
  if (!perstypes || !points) return <div></div>;
  let pointsHigh = [];
  for (let i = 0; i < points.length; i++) {
    if (points[i].Point > 5) {
      pointsHigh.push(points[i]);
    }
  }
  pointsHigh = orderBy(pointsHigh, "Point", "desc");
  let pers = map(pointsHigh, (item) => {
    return <Personality key={item.Id} uPoint={item} perstypes={perstypes} />;
  });

  let perDetails = map(pointsHigh, (item) => {
    return <PerstypeDetail key={item.Id} uPoint={item} perstypes={perstypes} />;
  });
  return (
    <div className="mt-5">
      <h3>Đặc điểm tính cách</h3>
      <div className="mt-5">{pers}</div>
      <div className="mt-5">
        <h3>Kiểu tính cách mạnh nhất của bạn</h3>
        <div className="mt-5">{line(points, perstypes)}</div>
        {perDetails}
      </div>
      <div className="d-flex justify-content-center mt-4">
        <Button onClick={props.onNextStep} appearance="primary">
          Tiếp Tục
        </Button>
      </div>
    </div>
  );
}

function Personality(props) {
  let { uPoint, perstypes } = props;

  let perstype = find(perstypes, ["Id", uPoint.PerstypeId]);
  return (
    <div>
      <h5>
        <span style={{ color: getColor(uPoint.Point) }}>{uPoint.Point}</span>{" "}
        {perstype.Name}
      </h5>
      {parse(perstype.GeneralFeatures)}
      {parse(perstype.Jobs)}
      <Button className="mb-4" appearance="link" onClick={props.onNextStep}>
        Khám phá thêm các công việc tương tự &gt;
      </Button>
    </div>
  );
}

let PerstypeDetail = (props) => {
  let { uPoint, perstypes } = props;
  let perstype = find(perstypes, ["Id", uPoint.PerstypeId]);
  return (
    <div className="border p-3 mt-4">
      <h3>{perstype.Name}</h3>
      <div className="row">
        <div className="col-md-3">
          <p className="font-weight-bold">Đặc điểm chung:</p>
          {parse(perstype.GeneralFeatures)}
        </div>
        <div className="col-md-3">
          <p className="font-weight-bold">Điểm mạnh:</p>
          {parse(perstype.Strengths)}
        </div>
        <div className="col-md-3">
          <p className="font-weight-bold">Điểm yếu:</p>
          {parse(perstype.Weakness)}
        </div>
        <div className="col-md-3">
          <p className="font-weight-bold">Công việc phù hợp:</p>
          {parse(perstype.JobDetail)}
        </div>
      </div>
    </div>
  );
};

let line = (p, pt) => {
  if (!p || !pt) return "";
  let lines = [];
  p = orderBy(p, "Point", "desc");
  for (let i = 0; i < p.length; i++) {
    let point = p[i].Point;
    let percent = parseInt((point / 33) * 100);
    let perstype = find(pt, ["Id", p[i].PerstypeId]);
    lines.push(
      <div className="col-12 p-0 mt-3 mb-3" key={i}>
        <div className="row no-gutters">
          <div className="col-md-2 col-sm-12">
            <span>
              {perstype.Name} {point}
            </span>
          </div>
          <div className="col-md-10 col-sm-12 ">
            <Line
              className="p-0"
              percent={percent}
              strokeColor={getColor(point)}
              showInfo={false}
            />
          </div>
        </div>
      </div>
    );
  }
  return lines;
};

let getColor = (point) => {
  let color = "";
  if (point >= 16) {
    color = "#58b15b";
  } else if (point >= 5 && point <= 15) {
    color = "#e7870f";
  } else {
    color = "#94928e";
  }
  return color;
};
