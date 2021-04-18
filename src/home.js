import { useState, useEffect, useContext } from "react";
import store from "./store";
import util from "./util";
import errors from "./errors";
import Menu from "./menu";
import Step from "./step";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import { orderBy, findIndex, shuffle, keyBy, find } from "lodash";
import { Alert, Loader, Placeholder } from "rsuite";

import { UserContext } from "./usercontext";

export default function Home() {
  let [userstr, stepstr] = useContext(UserContext);
  let [steps, setSteps] = useState();
  let [stepIndex, setStepIndex] = useState();
  let [tests, setTests] = useState();
  let [questions, setQuestions] = useState();
  let [resultsObj, setResultsObj] = useState([]);
  let [perstypes, setPerstypes] = useState();
  let [points, setPoints] = useState();
  let [careers, setCareers] = useState();

  useEffect(async () => {
    fetchData();
  }, []);

  async function fetchData() {
    let [st, err] = await fetchStep();
    if (err) return Alert.error(err);
    setSteps(st);
    let stepIndex = 0;
    if (stepstr) {
      let uStep = JSON.parse(stepstr);
      stepIndex = findIndex(st, ["Id", uStep.StepId]);
    }

    if (stepIndex == 0 || stepIndex == 1) {
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
    } else if (stepIndex == 2) {
      fetchResult();
    } else if (stepIndex == 3) {
      fetchResult();

      let [ca, errca] = await fetchCareers();
      if (errca) return Alert.error(errca);
      setCareers(ca);
    }

    setStepIndex(stepIndex);
  }

  async function fetchResult() {
    let [pt, errpt] = await fetchPerstypes();
    if (errpt) return Alert.error(errpt);
    setPerstypes(pt);

    let [p, err] = await fetchPoints();
    if (err) return Alert.error(err);
    // if (!p) p = [];
    setPoints(p);
  }

  function getStepDetail(stepIndex) {
    if (!steps) {
      return;
    }
    let step = steps[stepIndex];
    let std;
    switch (stepIndex) {
      case 0:
        std = (
          <Step1
            onNextStep={onNextStep}
            tests={tests}
            questions={getQuestionByStepId(step.Id)}
            resultsObj={resultsObj}
            onChangeResult={onChangeResult}
          />
        );
        break;
      case 1:
        std = (
          <Step2
            onNextStep={onNextStep}
            questions={shuffle(getQuestionByStepId(step.Id))}
          />
        );
        break;
      case 2:
        std = (
          <Step3
            perstypes={perstypes}
            points={points}
            onNextStep={onNextStep}
          />
        );
        break;
      case 3:
        std = (
          <Step4
            perstypes={perstypes}
            careers={careers}
            points={points}
            onBackStep={onBackStep}
          />
        );
        break;
    }
    return std;
  }

  function onChangeResult(questionId, perstypeId, point) {
    let rsObj = Object.assign({}, resultsObj);
    rsObj[questionId] = {
      QuestionId: questionId,
      Point: point,
      PerstypeId: perstypeId,
    };
    setResultsObj(rsObj);
    onNextStep();
  }

  let onNextStep = async () => {
    if (!steps) return;
    let nextStepId = steps[stepIndex + 1].Id;
    let [rsup, errup] = await store.updateUserStep(
      util.getCookie("access_token"),
      nextStepId,
      undefined
    );
    if (errup) return Alert.error("Lỗi hệ thống", errup);
    if (rsup.status !== 200) return Alert.error(rsup.error);
    if (stepIndex + 1 == 2) {
      fetchResult();
    }
    setStepIndex(stepIndex + 1);
    window.scrollTo({ top: 0 });
  };

  let onBackStep = async () => {
    setStepIndex(stepIndex - 1);
    window.scrollTo({ top: 0 });
  };

  function getQuestionByStepId(stepId) {
    let qs = [];
    for (let i = 0; i < tests.length; i++) {
      let qst = [];
      if (tests[i].StepId === stepId) {
        for (let j = 0; j < questions.length; j++) {
          if (questions[j].TestId == tests[i].Id) {
            qst.push(questions[j]);
          }
        }
        let qstSort = orderBy(qst, ["Index"], ["asc"]);
        qs = qs.concat(qstSort);
      }
    }
    return qs;
  }

  return (
    <div>
      <Menu />
      <Step steps={steps} stepIndex={stepIndex} />
      {getStepDetail(stepIndex)}
    </div>
  );
}

async function fetchStep() {
  let [rs, err] = await store.getStep(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  let data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  let dataSort = orderBy(data, ["Index"], ["asc"]);
  return [dataSort, undefined];
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

async function fetchCareers() {
  let [rs, err] = await store.listCareer(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  let data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}
