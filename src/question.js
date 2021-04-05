import {
  RadioGroup,
  Radio,
  Button,
  Icon,
  Alert,
  Loader,
  Placeholder,
} from "rsuite";
let { Paragraph } = Placeholder;

export default function Question(props) {
  let { test, questions, results } = props;
  if (!test || !questions || !results) {
    return (
      <Paragraph rows={8}>
        <Loader center content="loading" />
      </Paragraph>
    );
  }
  let qs = [];
  let countRs = 0;
  for (let i = 0; i < questions.length; i++) {
    let item = questions[i];
    let point = results[item.Id] ? results[item.Id].Point : undefined;
    if (point != undefined) countRs++;
    qs.push(
      <div key={i} className="d-flex flex-column">
        <span>
          {item.Index}, {item.Question}
        </span>
        <RadioResult
          questionId={item.Id}
          perstypeId={item.PerstypeId}
          onChange={props.onChange}
          value={point}
        />
      </div>
    );
  }
  return (
    <div className="col-12 mt-5 mb-5">
      <span className="h3">
        {test.Index}, {test.Name}
      </span>
      <div className="col-12 mt-4">
        <RadioGroup name="radioList">{qs}</RadioGroup>
      </div>
      <hr />
      <div className="d-flex justify-content-between mt-4">
        <Button disabled={test.Index <= 1} onClick={props.onBack}>
          <Icon icon="long-arrow-left" /> Quay lại
        </Button>
        <Button disabled={countRs !== questions.length} onClick={props.onNext}>
          Tiếp tục
          <Icon icon="long-arrow-right" />
        </Button>
      </div>
    </div>
  );
}

function RadioResult(props) {
  let { questionId, perstypeId, value } = props;
  return (
    <RadioGroup
      name="radioList"
      value={value}
      onChange={(point) => {
        props.onChange(questionId, perstypeId, point);
      }}
    >
      <Radio value={0}>Chưa bao giờ đúng</Radio>
      <Radio value={1}>Chỉ đúng trong một vài trường hợp</Radio>
      <Radio value={2}>Đúng hầu hết</Radio>
      <Radio value={3}>Hoàn toàn đúng</Radio>
    </RadioGroup>
  );
}
