import { useState } from "react";
import {
  Checkbox,
  CheckboxGroup,
  Button,
  RadioGroup,
  Radio,
  Loader,
  Placeholder,
  Alert,
  Icon,
} from "rsuite";
import { keyBy } from "lodash";
import store from "./store";
import util from "./util";
let { Paragraph } = Placeholder;

export default function Step2(props) {
  let { questions } = props;
  let [careers, setCareer] = useState([]);
  let [st, setSt] = useState(1);

  let render = "";
  if (st === 1) {
    render = (
      <CareerList
        questions={questions}
        careers={careers}
        onChange={(value) => setCareer(value)}
        onNext={() => setSt(2)}
      />
    );
  } else if (st === 2) {
    let qss = [];
    let objQs = keyBy(questions, "Id");
    console.log(objQs, careers);
    careers.forEach((item) => {
      qss.push(objQs[item]);
    });
    console.log(qss);
    render = <Questions questions={qss} onNextStep={props.onNextStep} />;
  }

  return <div>{render}</div>;
}

function Questions(props) {
  let [objPoint, setObjPoint] = useState({});
  let [qsIndex, setQsIndex] = useState(0);

  let { questions } = props;
  if (!questions) return <div></div>;

  let onChange = (qsId, perstypeId, point) => {
    objPoint[qsId] = {
      QuestionId: qsId,
      PerstypeId: perstypeId,
      Point: point,
    };
    let objP = Object.assign({}, objPoint);
    setObjPoint(objP);
    // onNext();
  };

  let onNext = async () => {
    if (qsIndex < questions.length - 1) {
      setQsIndex(qsIndex + 1);
    } else {
      let results = [];
      Object.values(objPoint).forEach((item) => {
        results.push({
          question_id: item.QuestionId,
          perstype_id: item.PerstypeId,
          point: item.Point,
        });
      });
      let [rs, err] = await store.postResult(
        util.getCookie("access_token"),
        results
      );
      if (err) return Alert.error("Lỗi hệ thống", err);
      if (rs.status !== 200) return Alert.error(rs.error);

      let [cal, errcal] = await store.calculatorPoint(
        util.getCookie("access_token")
      );
      if (errcal) return Alert.error("Lỗi hệ thống", errcal);
      if (cal.status !== 200) return Alert.error(cal.error);

      props.onNextStep();
    }
  };

  let onBack = () => {
    if (qsIndex >= 1) {
      setQsIndex(qsIndex - 1);
    }
  };

  return (
    <Question
      key={Math.random()}
      question={questions[qsIndex]}
      questionIndex={qsIndex}
      point={
        objPoint[questions[qsIndex].Id]
          ? objPoint[questions[qsIndex].Id].Point
          : undefined
      }
      onChange={(qsId, perstypeId, point) => onChange(qsId, perstypeId, point)}
      onNext={() => onNext()}
      onBack={() => onBack()}
    />
  );
}

function CareerList(props) {
  let { questions, careers } = props;
  let crs = [];
  for (let i = 0; i < questions.length; i++) {
    let item = questions[i];
    crs.push(
      <Checkbox className="col-xs-6 col-sm-6 col-md-3" value={item.Id} key={i}>
        {item.Question}
      </Checkbox>
    );
  }

  return (
    <div className="card mt-5">
    <div className="card-body">
      <CheckboxGroup
        className="row no-gutters"
        name="checkboxList"
        value={careers}
        onChange={props.onChange}
      >
        {crs}
      </CheckboxGroup>
      <div className="d-flex justify-content-center mt-4">
        <Button onClick={props.onNext} appearance="primary">
          Tiếp Tục
        </Button>
      </div>
    </div>
    </div>
  );
}

function Question(props) {
  let { question, questionIndex, point } = props;
  console.log(question, point);
  if (!question)
    return (
      <Paragraph rows={8}>
        <Loader center content="loading" />
      </Paragraph>
    );
  return (
    <div className="card d-flex flex-column mt-5">
    <div className="card-body">
      <span>Mức độ quan tâm nghề {question.Question}</span>
      <RadioGroup
        name="radioList"
        value={point}
        onChange={(value) => {
          props.onChange(question.Id, question.PerstypeId, value);
        }}
      >
        <Radio value={0}>Không quan tâm</Radio>
        <Radio value={1}>Có quan tâm chút ít</Radio>
        <Radio value={2}>Quan tâm</Radio>
        <Radio value={3}>Rất quan tâm</Radio>
      </RadioGroup>
      <hr />
      <div className="d-flex justify-content-center mt-4">
        <Button
          className="mr-5"
          color="blue"
          disabled={questionIndex < 1}
          onClick={props.onBack}
        >
          <Icon icon="long-arrow-left" />
          {/* Quay lại */}
        </Button>
        <Button
          color="blue"
          disabled={point == undefined}
          onClick={props.onNext}
        >
          {/* Tiếp tục */}
          <Icon icon="long-arrow-right" />
        </Button>
      </div>
    </div>
    </div>
  );
}
