import React from "react";
import { Form } from "react-bootstrap";

const LoginBox = () => {
  return (
    <div>
      <Form>
        <input
          type="text"
          class="form-control"
          placeholder="Email Address"
          id="noColour"
        ></input>

        <input
          type="password"
          class="form-control"
          placeholder="Password"
          id="noColour"
        ></input>
      </Form>
    </div>
  );
};

export default LoginBox;
