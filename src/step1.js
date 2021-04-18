import { useState, useEffect, useContext } from "react";
import store from "./store";
import util from "./util";
import { findIndex, find } from "lodash";
import { Alert, Loader, Placeholder } from "rsuite";
import Question from "./question";
import { UserContext } from "./usercontext";
let { Paragraph } = Placeholder;
export default function Step1(props) {
  let [userstr, stepstr] = useContext(UserContext);
  let { tests, questions, resultsObj } = props;
  let [userStep, setUserStep] = useState();

  useEffect(async () => {
    initUStep();
  }, []);

  if (!tests || !questions) {
    return (
      <Paragraph rows={8}>
        <Loader center content="loading" />
      </Paragraph>
    );
  }
  console.log(userStep);
  if (!userStep) {
    userStep = {
      StepId: tests[0].StepId,
      TestId: questions[0].TestId,
      QuestionId: questions[0].Id,
    };
  } else {
  }

  let question = find(questions, ["Id", userStep.QuestionId]);
  let point = resultsObj[userStep.QuestionId]
    ? resultsObj[userStep.QuestionId].Point
    : undefined;

  let test = find(tests, ["Id", question.TestId]);

  return (
    <div className="mt-4">
      <span className="h4">
        {test.Index}, {test.Name}
      </span>
      <Question
        key={Math.random()}
        question={question}
        questionIndex={findIndex(questions, ["Id", question.Id])}
        point={point}
        onChange={props.onChangeResult}
        onNext={onNext}
        onBack={onBack}
      />
    </div>
  );

  function initUStep() {
    if (stepstr) {
      let uStep = JSON.parse(stepstr);
      setUserStep(uStep);
    }
  }

  async function onBack() {
    let qsIndex = findIndex(questions, ["Id", question.Id]);
    console.log(qsIndex, questions, question);
    if (qsIndex >= 1) {
      let qsBack = questions[qsIndex - 1];
      setUserStep({
        StepId: userStep.StepId,
        TestId: qsBack.TestId,
        QuestionId: qsBack.Id,
      });
      window.scrollTo({ top: 0 });
    }
  }

  async function onNext() {
    console.log(userStep, question);
    let results = [
      {
        question_id: question.Id,
        point: resultsObj[userStep.QuestionId].Point,
        perstype_id: question.PerstypeId,
      },
    ];

    let [rs, err] = await store.postResult(
      util.getCookie("access_token"),
      results
    );
    if (err) return Alert.error("Lỗi hệ thống", err);
    if (rs.status !== 200) return Alert.error(rs.error);

    let [rsup, errup] = await store.updateUserStep(
      util.getCookie("access_token"),
      userStep.StepId,
      userStep.TestId,
      userStep.QuestionId
    );
    if (errup) return Alert.error("Lỗi hệ thống", errup);
    if (rsup.status !== 200) return Alert.error(rsup.error);

    let qsIndex = findIndex(questions, ["Id", question.Id]);
    if (qsIndex < questions.length - 1) {
      let nextQs = questions[qsIndex + 1];
      setUserStep({
        StepId: userStep.StepId,
        TestId: nextQs.TestId,
        QuestionId: nextQs.Id,
      });
      window.scrollTo({ top: 0 });
    } else {
      props.onNextStep(userStep.StepId);
      // Alert.success("Sang chuong moi");
    }
  }
}
