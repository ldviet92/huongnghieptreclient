import { useState, useEffect, useContext } from "react";
import store from "./store";
import util from "./util";
import errors from "./errors";
import Menu from "./menu";
import Step from "./step";
import Test from "./test";
import ResultTest from "./resultTest";
import { orderBy, findIndex, filter, keyBy } from "lodash";
import { Alert, Loader, Placeholder } from "rsuite";

import { UserContext } from "./usercontext";

export default function Home() {
  let [userstr, stepstr] = useContext(UserContext);
  let [steps, setSteps] = useState();
  let [stepDetail, setStepDetail] = useState([]);
  let [stepIndex, setStepIndex] = useState();

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
    setStepIndex(stepIndex);
    // getStepDetail(stepIndex);
  }

  function getStepDetail(stepIndex) {
    let std;
    switch (stepIndex) {
      case 0:
        std = <Test onNextStep={onNextStep} />;
        break;
      case 1:
        std = <Test onNextStep={onNextStep} />;
        break;
      case 2:
        std = <ResultTest />;
        break;
      case (3, 4):
        std = <div>4,5</div>;
        break;
    }
    return std;
  }

  let onNextStep = async (stepId) => {
    console.log(steps);
    if (!steps) return;
    let stepIndex = findIndex(steps, ["Id", stepId]);
    console.log(stepId);
    let stepIdNext = steps[stepIndex + 1].Id;
    let [rsup, errup] = await store.updateUserStep(
      util.getCookie("access_token"),
      stepIdNext,
      undefined
    );
    if (errup) return Alert.error("Lỗi hệ thống", errup);
    if (rsup.status !== 200) return Alert.error(rsup.error);
    setStepIndex(stepIndex + 1);
  };

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
