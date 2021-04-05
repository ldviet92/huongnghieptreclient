import React from "react";
export const UserContext = React.createContext({
  user: JSON.stringify({ id: undefined, email: "user", fullname: undefined }),
  step: JSON.stringify({
    id: undefined,
    user_id: undefined,
    step_id: undefined,
    test_id: undefined,
  }),
});

// export const StepContext = React.createContext({

// });
