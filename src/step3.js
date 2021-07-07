import { find, map, orderBy, filter } from "lodash";
import { Progress, Button, Badge } from "rsuite";
import parse from "html-react-parser";
const { Line } = Progress;

export default function Step3(props) {
  const { perstypes, points } = props;
  if (!perstypes || !points) return <div />;
  let pointsSort = [];
  pointsSort = orderBy(points, "Point", "desc");

  const pointsProspecting = filter(pointsSort, (item) => item.Point >= 16);
  const pointsPromising = filter(
    pointsSort,
    (item) => item.Point > 5 && item.Point <= 15
  );
  const pointsChallenging = filter(pointsSort, (item) => item.Point <= 5);

  const persProspecting = map(pointsProspecting, (item) => {
    return (
      <Personality
        key={item.Id}
        uPoint={item}
        perstypes={perstypes}
        onChangePerstypeIdChoose={(e) => onChangePerstypeIdChoose(e)}
      />
    );
  });

  const persPromising = map(pointsPromising, (item) => {
    return (
      <Personality
        key={item.Id}
        uPoint={item}
        perstypes={perstypes}
        onChangePerstypeIdChoose={(e) => onChangePerstypeIdChoose(e)}
      />
    );
  });

  const persChallenging = map(pointsChallenging, (item) => {
    return (
      <Personality
        key={item.Id}
        uPoint={item}
        perstypes={perstypes}
        onChangePerstypeIdChoose={(e) => onChangePerstypeIdChoose(e)}
      />
    );
  });

  const perDetails = map(pointsSort, (item) => {
    return (
      <PerstypeDetail
        key={item.Id}
        uPoint={item}
        perstypes={perstypes}
        onChangePerstypeIdChoose={(e) => onChangePerstypeIdChoose(e)}
      />
    );
  });

  const onChangePerstypeIdChoose = (perstypeId) => {
    props.onChangePerstypeIdChoose(perstypeId);
    // props.onNextStep
  };
  return (
    <div className="mt-5">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Đặc điểm tính cách</h3>
        </div>
        <div className="card-body mt-5">
          <div>
            <h3>
              {" "}
              <Badge
                style={{
                  background: getColor(17),
                  marginTop: 6,
                  marginRight: 5,
                }}
              />
              Rất triển vọng
            </h3>
            <hr />
            {persProspecting}
          </div>
          <div>
            <h3>
              <Badge
                style={{
                  background: getColor(15),
                  marginTop: 6,
                  marginRight: 5,
                }}
              />
              Hứa hẹn
            </h3>
            <hr />
            {persPromising}
          </div>
          <div>
            <h3>
              <Badge
                style={{
                  background: getColor(4),
                  marginTop: 6,
                  marginRight: 5,
                }}
              />
              Thử thách
            </h3>
            <hr />
            {persChallenging}
          </div>
        </div>
      </div>
      <div className="card mt-5">
        <div className="card-header">
          <h3>Kiểu tính cách mạnh nhất của bạn</h3>
        </div>
        <div className="card-body">{line(points, perstypes)}</div>
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
  const { uPoint, perstypes } = props;

  const perstype = find(perstypes, ["Id", uPoint.PerstypeId]);
  if (uPoint.Point <= 5) {
    return (
      <div>
        <h5>
          <span style={{ color: getColor(uPoint.Point) }}>{uPoint.Point}</span>{" "}
          {perstype.Name}
        </h5>
      </div>
    );
  }

  return (
    <div>
      <h5>
        <span style={{ color: getColor(uPoint.Point) }}>{uPoint.Point}</span>{" "}
        {perstype.Name}
      </h5>
      {parse(perstype.GeneralFeatures)}
      {parse(perstype.Jobs)}
      <Button
        className="mb-4"
        appearance="link"
        onClick={() => props.onChangePerstypeIdChoose(perstype.Id)}
      >
        Khám phá thêm các công việc tương tự &gt;
      </Button>
    </div>
  );
}

const PerstypeDetail = (props) => {
  const { uPoint, perstypes } = props;
  const perstype = find(perstypes, ["Id", uPoint.PerstypeId]);
  return (
    <div className="border-top p-3 mt-4">
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
          <Button
            className="mb-4 text-wrap"
            appearance="link"
            onClick={(e) => props.onChangePerstypeIdChoose(perstype.Id)}
          >
            Khám phá thêm các công việc tương tự &gt;
          </Button>
        </div>
      </div>
    </div>
  );
};

const line = (p, pt) => {
  if (!p || !pt) return "";
  const lines = [];
  p = orderBy(p, "Point", "desc");
  for (let i = 0; i < p.length; i++) {
    const point = p[i].Point;
    const percent = parseInt((point / 33) * 100);
    const perstype = find(pt, ["Id", p[i].PerstypeId]);
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

const getColor = (point) => {
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
