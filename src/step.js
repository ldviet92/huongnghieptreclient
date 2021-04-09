import { useEffect, useState } from "react";
import { Steps, Icon } from "rsuite";
export default function Step(props) {
  let { steps, stepIndex } = props;

  useEffect(() => {}, []);
  if (!steps || !stepIndex) return <div></div>;
  console.log(steps, stepIndex);
  let stepTemp = () => {
    if (steps) {
      let st = [];
      for (let i = 0; i < steps.length; i++) {
        st.push(<Steps.Item key={i} title={steps[i].Name} />);
      }
      return st;
    }
  };

  return (
    <div className="d-flex mt-4">
      <div className="d-none d-sm-block justify-content-center w-100 p-3">
        <Steps current={stepIndex} className="w-100">
          {stepTemp()}
        </Steps>
      </div>
      <div className="d-block d-sm-none">
        <Steps current={0} className="w-100">
          <Steps.Item
            key={stepIndex}
            title={steps[stepIndex].Name}
            className="text-dark"
            icon={<Icon icon="list-ol" size="lg" />}
          />
        </Steps>
        {/* <h4>
          {steps[stepIndex].Index}, {steps[stepIndex].Name}
        </h4> */}
      </div>
    </div>
  );
}
