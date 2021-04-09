import { RadioGroup, Radio, Loader, Placeholder, Button, Icon } from "rsuite";
let { Paragraph } = Placeholder;

export default function Question(props) {
  let { question, questionIndex, point } = props;
  console.log(question, point);
  if (!question)
    return (
      <Paragraph rows={8}>
        <Loader center content="loading" />
      </Paragraph>
    );

  return (
    <div className="d-flex flex-column mt-5">
      <span>{question.Question}</span>
      <RadioGroup
        name="radioList"
        value={point}
        onChange={(value) => {
          props.onChange(question.Id, question.PerstypeId, value);
        }}
      >
        <Radio value={0}>Chưa bao giờ đúng</Radio>
        <Radio value={1}>Chỉ đúng trong một vài trường hợp</Radio>
        <Radio value={2}>Đúng hầu hết</Radio>
        <Radio value={3}>Hoàn toàn đúng</Radio>
      </RadioGroup>
      <hr />
      <div className="d-flex justify-content-between mt-4">
        <Button disabled={questionIndex <= 1} onClick={props.onBack}>
          <Icon icon="long-arrow-left" />
          {/* Quay lại */}
        </Button>
        <Button disabled={point == undefined} onClick={props.onNext}>
          {/* Tiếp tục */}
          <Icon icon="long-arrow-right" />
        </Button>
      </div>
    </div>
  );
}
