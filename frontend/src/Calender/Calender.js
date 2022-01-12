import React from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  WeekView,
  ViewSwitcher,
  Toolbar,
} from "@devexpress/dx-react-scheduler-material-ui";

//  https://devexpress.github.io/devextreme-reactive/react/scheduler/docs/guides/editing/

//  RAFCE
const Calender = (props) => {
  const currentDate = new Date(props.sharedDateObj.currentDate);

  return (
    <Paper>
      <Scheduler>
        <ViewState
          currentDate={props.sharedDateObj.currentDate}
          defaultCurrentViewName="Week"
        ></ViewState>

        <DayView startDayHour={10} endDayHour={17}></DayView>
        <WeekView startDayHour={10} endDayHour={17}></WeekView>

        <Toolbar />
        <ViewSwitcher />
      </Scheduler>
    </Paper>
  );
};

export default Calender;
