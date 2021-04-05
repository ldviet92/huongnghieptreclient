import { useEffect, useState } from "react";
import { Steps } from "rsuite";
export default function Step(props) {
  let { steps, stepIndex } = props;

  useEffect(() => {}, []);

  let stepTemp = () => {
    if (steps) {
      let st = [];
      for (let i = 0; i < steps.length; i++) {
        st.push(<Steps.Item key={i} title={steps[i].Name} />);
      }
      console.log(steps, st);
      return st;
    }
  };

  return (
    <div className="d-flex justify-content-center p-3">
      <Steps current={stepIndex} className="w-100">
        {stepTemp()}
      </Steps>
    </div>
  );
}
