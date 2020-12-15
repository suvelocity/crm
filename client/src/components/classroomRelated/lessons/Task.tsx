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
  title: string;
  body: string;
  description: string;
}
export default function Task({ task, index }: { task: Task; index: number }) {
  const [challengeType, setChallengeType] = useState<string>("manual");
  const [challenge, setChallenge] = useState<string>("");

export default function Task({
  task,
  index,
  handleChange,
}: {
  task: Task;
  index: number;
  handleChange: (element: string, index: number, change: any) => void;
}) {
  const changer = (
    e: React.ChangeEvent<{ value: unknown }>,
    toChange: string
  ) => {
    handleChange(toChange, index, e.target.value);
  };

  return (
    <div>
      <hr />
      <>
        <Input
          variant='outlined'
          label='Task title'
          value={task.title}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            changer(e, "title");
          }}
        />
        {/* <div>title: {task.title}</div> */}
      </>

      <Select
        value={task.type}
        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
          changer(e, "type");
        }}>
        <MenuItem value='manual'>manual</MenuItem>
        <MenuItem value='challengeMe'>challengeMe</MenuItem>
        <MenuItem value='fcc'>fcc</MenuItem>
        <MenuItem value='quiz'>quiz</MenuItem>
      </Select>
      <br />
      {task.type === "manual" ? (
        <Input
          variant='outlined'
          label='Link to task'
          value={task.externalLink}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            changer(e, "externalLink");
          }}
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
      <Input
        variant='outlined'
        label='Task Description'
        value={task.description}
        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
          changer(e, "description");
        }}
      />
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
