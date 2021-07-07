import { useState, useEffect, useContext, useRef } from "react";
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
import { Alert } from "rsuite";

import { UserContext } from "./usercontext";

export default function Home() {
  const [userstr, stepstr] = useContext(UserContext);
  const [steps, setSteps] = useState();
  const [stepIndex, setStepIndex] = useState();
  const [tests, setTests] = useState();
  const [questions, setQuestions] = useState();
  const [resultsObj, setResultsObj] = useState([]);
  const [perstypes, setPerstypes] = useState();
  const [points, setPoints] = useState();
  const [careers, setCareers] = useState();
  const [perstypeIdChoose, setPerstypeIdChoose] = useState("");
  const [cgs, setCgs] = useState("");

  useEffect(async () => {
    fetchData();
  }, []);

  async function fetchData() {
    const [st, err] = await fetchStep();
    if (err) return Alert.error(err);
    setSteps(st);
    let stepIndex = 0;
    if (stepstr) {
      const uStep = JSON.parse(stepstr);
      stepIndex = findIndex(st, ["Id", uStep.StepId]);
    }

    if (stepIndex === 0 || stepIndex === 1) {
      const [ts, errts] = await fetchTest();
      if (errts) return Alert.error(errts);
      setTests(ts);

      const [qs, errqs] = await fetchQuestion();
      if (errqs) return Alert.error(errqs);
      setQuestions(qs);

      const [uq, erruq] = await fetchUserQuestion();
      if (erruq) return Alert.error(erruq);
      let uqObj = {};
      if (uq) uqObj = keyBy(uq, "QuestionId");
      setResultsObj(uqObj);
    } else if (stepIndex === 2) {
      fetchResult();
    } else if (stepIndex === 3) {
      fetchResult();
    }

    setStepIndex(stepIndex);
  }

  async function fetchResult() {
    const [pt, errpt] = await fetchPerstypes();
    if (errpt) return Alert.error(errpt);
    setPerstypes(pt);

    const [p, err] = await fetchPoints();
    if (err) return Alert.error(err);
    setPoints(p);

    const [ca, errca] = await fetchCareers();
    if (errca) return Alert.error(errca);
    setCareers(ca);

    const [cgs, errcgs] = await fetchCareerGroups();
    if (errcgs) return Alert.error(errcgs);
    setCgs(cgs);
  }

  function getStepDetail(stepIndex) {
    if (!steps) {
      return;
    }
    const step = steps[stepIndex];
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
            onChangePerstypeIdChoose={(e) => {
              setPerstypeIdChoose(e);
              onNextStep();
            }}
          />
        );
        break;
      case 3:
        std = (
          <Step4
            perstypes={perstypes}
            perstypeIdChoose={perstypeIdChoose}
            careers={careers}
            points={points}
            onBackStep={onBackStep}
            careerGroups = {cgs}
          />
        );
        break;
    }
    return std;
  }

  function onChangeResult(questionId, perstypeId, point) {
    const rsObj = Object.assign({}, resultsObj);
    rsObj[questionId] = {
      QuestionId: questionId,
      Point: point,
      PerstypeId: perstypeId,
    };
    setResultsObj(rsObj);
  }

  const onNextStep = async () => {
    if (!steps) return;
    const nextStepId = steps[stepIndex + 1].Id;
    const [rsup, errup] = await store.updateUserStep(
      util.getCookie("access_token"),
      nextStepId,
      undefined
    );
    if (errup) return Alert.error("Lỗi hệ thống", errup);
    if (rsup.status !== 200) return Alert.error(rsup.error);
    if (stepIndex + 1 >= 2) {
      fetchResult();
    }
    setStepIndex(stepIndex + 1);
    window.scrollTo({ top: 0 });
  };

  const onBackStep = async () => {
    setStepIndex(stepIndex - 1);
    window.scrollTo({ top: 0 });
  };

  function getQuestionByStepId(stepId) {
    let qs = [];
    for (let i = 0; i < tests.length; i++) {
      const qst = [];
      if (tests[i].StepId === stepId) {
        for (let j = 0; j < questions.length; j++) {
          if (questions[j].TestId === tests[i].Id) {
            qst.push(questions[j]);
          }
        }
        const qstSort = orderBy(qst, ["Index"], ["asc"]);
        qs = qs.concat(qstSort);
      }
    }
    return qs;
  }

  return (
    <div className="mb-5">
      <Menu />
      <Step steps={steps} stepIndex={stepIndex} />
      {getStepDetail(stepIndex)}
    </div>
  );
}

async function fetchStep() {
  const [rs, err] = await store.getStep(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  const data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  const dataSort = orderBy(data, ["Index"], ["asc"]);
  return [dataSort, undefined];
}

async function fetchUserQuestion() {
  const [rs, err] = await store.listUserQuestions(
    util.getCookie("access_token")
  );
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  const data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}

async function fetchQuestion() {
  const [rs, err] = await store.getQuestions(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  const data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}

async function fetchTest() {
  const [rs, err] = await store.getTest(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  const data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  const dataSort = orderBy(data, ["Index"], ["asc"]);
  return [dataSort, undefined];
}

async function fetchPerstypes() {
  const [rs, err] = await store.listPerstype();
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  const data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}

async function fetchPoints() {
  const [rs, err] = await store.listUserPoint(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  const data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}

async function fetchCareers() {
  const [rs, err] = await store.listCareer(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  const data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}

async function fetchCareerGroups() {
  let [rs, err] = await store.listCareerGroup(util.getCookie("access_token"));
  if (err) return [undefined, err];
  if (rs.status !== 200) return [undefined, rs.error];
  const data = rs.data;
  if (data == null) return [undefined, errors.NO_DATA];
  return [data, undefined];
}
