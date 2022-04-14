import React from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import CalenderPicker from "../CalenderPicker/CalenderPicker";

import "./Jumbotron.scss";

const Jumbotron = (props) => {
  if (!props.user) {
  } else {
    return (
      <div className="calenderColour">
        <h1>SELECT A DATE</h1>
        <CalenderPicker
          sharedDateObj={props.sharedDateObj}
          setDate={props.setDate}
        />
      </div>
    );
  }
};

export default Jumbotron;
