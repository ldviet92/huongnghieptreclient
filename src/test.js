import { useState, useEffect, useContext } from "react";
import store from "./store";
import util from "./util";
import { orderBy, findIndex, filter, keyBy } from "lodash";
import { Alert, Loader, Placeholder } from "rsuite";
import Question from "./question";
import { UserContext } from "./usercontext";
import errors from "./errors";
let { Paragraph } = Placeholder;
export default function Test(props) {
  let [userstr, stepstr] = useContext(UserContext);
  let [tests, setTests] = useState();
  let [questions, setQuestions] = useState();
  let [resultsObj, setResultsObj] = useState([]);
  let [userStep, setUserStep] = useState();

  useEffect(async () => {
    fetchData();
  }, []);

  async function fetchData() {
    let [ts, errts] = await fetchTest();
    if (errts) return Alert.error(errqs);
    setTests(ts);

    let [qs, errqs] = await fetchQuestion();
    if (errqs) return Alert.error(errqs);
    setQuestions(qs);

    let [uq, erruq] = await fetchUserQuestion();
    if (erruq) return Alert.error(erruq);
    let uqObj = {};
    if (uq) uqObj = keyBy(uq, "QuestionId");
    setResultsObj(uqObj);

    initUStep(ts);
  }

  return (
    <div>
      <FilterQuestions />
    </div>
  );

  function initUStep(ts) {
    if (stepstr) {
      let uStep = JSON.parse(stepstr);
      let testIndex = findIndex(ts, ["Id", uStep.TestId]);
      if (testIndex < ts.length - 1) {
        console.log(testIndex, ts[testIndex + 1]);
        getUserStep(ts[testIndex + 1].StepId, ts[testIndex + 1].Id, ts);
      } else {
        getUserStep(ts[testIndex].StepId, ts[testIndex].Id, ts);
      }
    } else {
      getUserStep(undefined, undefined, ts);
    }
  }

  function getUserStep(stepId, testId, ts) {
    if (!ts) return;
    if (!stepId) {
      stepId = ts[0].StepId;
      testId = ts[0].Id;
    } else {
    }
    setUserStep({
      StepId: stepId,
      TestId: testId,
    });
  }

  function FilterQuestions() {
    if (!tests || !questions) {
      return (
        <Paragraph rows={8}>
          <Loader center content="loading" />
        </Paragraph>
      );
    }
    if (!userStep) {
      userStep = {
        StepId: tests[0].StepId,
        TestId: tests[0].Id,
      };
    }

    let test = tests.find((e) => e.Id === userStep.TestId);
    console.log(userStep, test);
    let questionByTestId = filter(questions, ["TestId", userStep.TestId]);
    let questionSort = orderBy(questionByTestId, ["Index"], ["asc"]);
    console.log(questionSort);
    return (
      <div>
        <Question
          test={test}
          questions={questionSort}
          results={resultsObj}
          onChange={onChange}
          onNext={onNext}
          onBack={onBack}
        />
      </div>
    );
  }

  async function onBack() {
    let testIndex = findIndex(tests, ["Id", userStep.TestId]);
    if (testIndex > 0) {
      console.log(testIndex, tests[testIndex - 1]);
      setUserStep({
        StepId: tests[testIndex - 1].StepId,
        TestId: tests[testIndex - 1].Id,
      });
      window.scrollTo({ top: 0 });
    }
  }

  async function onNext() {
    let results = [];
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].TestId == userStep.TestId) {
        results.push({
          question_id: questions[i].Id,
          point: resultsObj[questions[i].Id].Point,
          perstype_id: questions[i].PerstypeId,
        });
      }
    }
    let [rs, err] = await store.postResult(
      util.getCookie("access_token"),
      results
    );
    if (err) return Alert.error("Lỗi hệ thống", err);
    if (rs.status !== 200) return Alert.error(rs.error);

    let [rsup, errup] = await store.updateUserStep(
      util.getCookie("access_token"),
      userStep.StepId,
      userStep.TestId
    );
    if (errup) return Alert.error("Lỗi hệ thống", errup);
    if (rsup.status !== 200) return Alert.error(rsup.error);
    nextStep();
  }

  async function nextStep() {
    let testIndex = findIndex(tests, ["Id", userStep.TestId]);
    if (testIndex < tests.length - 1) {
      console.log(testIndex, tests[testIndex + 1]);
      setUserStep({
        StepId: tests[testIndex + 1].StepId,
        TestId: tests[testIndex + 1].Id,
      });
      window.scrollTo({ top: 0 });
    } else {
      let [rs, err] = await store.calculatorPoint(
        util.getCookie("access_token")
      );
      if (err) return Alert.error("Lỗi hệ thống", err);
      if (rs.status !== 200) return Alert.error(rs.error);
      props.onNextStep(userStep.StepId);
      Alert.success("Sang chuong moi");
    }
  }

  function onChange(questionId, perstypeId, point) {
    let rsObj = Object.assign({}, resultsObj);
    rsObj[questionId] = {
      QuestionId: questionId,
      Point: point,
      PerstypeId: perstypeId,
    };
    setResultsObj(rsObj);
  }
}

async function fetchUserQuestion() {
  let [rs, err] = await store.listUserQuestions(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  let data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}

async function fetchQuestion() {
  let [rs, err] = await store.getQuestions(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  let data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}

async function fetchTest() {
  let [rs, err] = await store.getTest(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  let data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  let dataSort = orderBy(data, ["Index"], ["asc"]);
  return [dataSort, undefined];
}
