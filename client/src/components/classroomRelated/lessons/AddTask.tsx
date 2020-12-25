import React from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Tooltip from "@material-ui/core/Tooltip";
import { IStudent } from "../../../typescript/interfaces";

interface Task {
  externalLink?: string;
  createdBy: number;
  endDate: Date;
  type: string;
  title: string;
  body?: string;
  status: "active" | "disabled";
}

export default function AddTask({
  task,
  index = 0,
  handleChange,
  handleRemove,
  students,
  studentsToTask,
}: {
  task: Task;
  index?: number;
  handleChange: (element: string, index: number, change: any) => void;
  handleRemove: (index: number, name: string) => void;
  students?: IStudent[];
  studentsToTask?: number[];
}) {
  const changer = (
    e: React.ChangeEvent<{ value: unknown }>,
    toChange: string
  ) => {
    handleChange(toChange, index, e.target.value);
  };

  const removeTask = () => {
    handleRemove(index, "task");
  };

  return (
    <div
      className='create-task'
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <hr />
      <Tooltip title='Remove task'>
        <DeleteForeverIcon onClick={removeTask} />
      </Tooltip>
      <Select
        style={selectStyle}
        value={task.type}
        variant='outlined'
        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
          changer(e, "type");
        }}
      >
        <MenuItem value='manual'>manual</MenuItem>
        <MenuItem value='challengeMe'>challengeMe</MenuItem>
        <MenuItem value='fcc'>fcc</MenuItem>
        <MenuItem value='quiz'>quiz</MenuItem>
      </Select>
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
        <Select //TODO change to challenge type
          style={selectStyle}
          value={task.title}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            changer(e, "title");
          }}
          variant='outlined'
          defaultValue='Pick a Task'
        >
          <MenuItem value={"challenge1"}>challenge1</MenuItem>
          <MenuItem value={"challenge2"}>challenge2</MenuItem>
          <MenuItem value={"challenge3"}>challenge3</MenuItem>
        </Select>
      )}
      <>
        <Input
          disabled={task.type === "manual" ? false : true}
          variant='outlined'
          label='Task title'
          value={task.title}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            changer(e, "title");
          }}
        />
      </>
      <Input
        variant='outlined'
        label='Task Description'
        value={task.body}
        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
          changer(e, "body");
        }}
      />
      <hr />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          minDate={new Date()}
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
      <Select
        style={selectStyle}
        value={task.status}
        onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
          changer(e, "status");
        }}
        variant='outlined'
        defaultValue='Pick a Status'
      >
        <MenuItem value={"active"}>active</MenuItem>
        <MenuItem value={"disabled"}>disabled</MenuItem>
      </Select>
      {students && studentsToTask !== undefined && (
        <Select
          multiple
          defaultValue={students.map((student) => {
            return student.id;
          })}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            changer(e, "students");
          }}
        >
          {students.map((student: IStudent) => {
            return (
              <MenuItem key={student.id} value={student.id}>
                {`${student.firstName} ${student.lastName}`}
              </MenuItem>
            );
          })}
        </Select>
      )}
    </div>
  );
}

const Input = styled(TextField)`
  margin-top: 5px;
  margin-bottom: 5px;
`;

const selectStyle = { marginTop: "5px", marginBottom: "5px" };
