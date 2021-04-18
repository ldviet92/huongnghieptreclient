import { Button, Loader, Placeholder } from "rsuite";
import { keyBy } from "lodash";

let { Paragraph } = Placeholder;
export default function step4(props) {
  let { careers, perstypes, points } = props;
  let perstypeObj = keyBy(perstypes, "Id");

  if (!careers || !perstypes || !points)
    return (
      <div>
        {" "}
        <Paragraph rows={8}>
          <Loader center content="loading" />
        </Paragraph>
      </div>
    );

  let pointObj = keyBy(points, "PerstypeId");
  let caRow = [];
  for (let i = 0; i < careers.length; i++) {
    let ca = careers[i];
    if (pointObj[ca.PerstypeId].Point < 5) continue;
    caRow.push(
      <tr key={i}>
        <td>{ca.Name}</td>
        <td>{perstypeObj[ca.PerstypeId].Name}</td>
      </tr>
    );
  }

  return (
    <div>
      <table className="table table-bordered mt-5">
        <thead>
          <tr>
            <td className="text-center font-weight-bold" scope="col">
              Nghề
            </td>
            <td className="text-center font-weight-bold" scope="col">
              Nhóm nghề
            </td>
            {/* <td>Trường</td> */}
          </tr>
        </thead>
        <tbody>{caRow}</tbody>
      </table>
      <div className="d-flex justify-content-center mt-5">
        <Button onClick={props.onBackStep} appearance="primary">
          Quay lại
        </Button>
      </div>
    </div>
  );
}
