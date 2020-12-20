import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

interface Task {
  externalLink?: string;
  createdBy: number;
  endDate: Date;
  type: string;
  body: string;
}

export default function Task({
  task,
  index,
  handleChange,
}: {
  task: Task;
  index: number;
  handleChange: (element: string, index: number, change: any) => void;
}) {
  return (
    <div>
      <hr />
      {task.type === "manual" && (
        <>
          <Input
            variant='outlined'
            label='Task name'
            value={task.externalLink}
            onChange={(
              e: React.ChangeEvent<{ value: unknown }> //TODO move to funtion upword
            ) => handleChange("title", index, e.target.value)}
          />
          <div>name: {task.body}</div>
        </>
      )}
      <Select
        value={task.type}
        onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
          handleChange("type", index, e.target.value)
        }
      >
        <MenuItem value='manual'>manual</MenuItem>
        <MenuItem value='challengeMe'>challengeMe</MenuItem>
        <MenuItem value='fcc'>fcc</MenuItem>
      </Select>
      <br />
      {task.type === "manual" ? (
        <input
          onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
            handleChange("externalLink", index, e.target.value)
          }
        />
      ) : (
        <div></div>
        // <Select //TODO change to challenge type
        //   value={challenge}
        //   onChange={handleChallengeChange}
        //   defaultValue='pick challenge'
        // >
        //   <MenuItem value={"manual"}>manual</MenuItem>
        //   <MenuItem value={"challengeMe"}>challengeMe</MenuItem>
        //   <MenuItem value={"fcc"}>fcc</MenuItem>
        // </Select>
      )}
      <hr />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant='inline'
          format='MM/dd/yyyy'
          margin='normal'
          id='date-picker-inline'
          label='Date picker inline'
          value={task.endDate}
          onChange={(e: Date | null) => handleChange("endDate", index, e)}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
const Input = styled(TextField)`
  margin-bottom: 10px;
`;
