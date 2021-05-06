import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  TextField,
  Tooltip,
  InputLabel,
  MenuItem,
  FormControl,
  makeStyles,
  Button,
} from "@material-ui/core";
import SearchCreateSelect from "react-select/async-creatable";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  IClassOfTeacher,
  ILabel,
  IStudent,
  ITaskLabel,
} from "../../../typescript/interfaces";
import ChallengeSelector from "./ChallengeSelector";
import { ITask } from "../../../typescript/interfaces";
import ClassAccordion from "./ClassAccordion";
import { LabelView } from "../tasks/LabelView";
import { network } from "../../../helpers";
interface addTaskProps {
  task: Partial<ITask>;
  index?: number;
  handleChange: (element: string, index: number, change: any) => void;
  handleRemove: (index: number, name: string) => void;
  students?: IStudent[];
  teacherClasses?: IClassOfTeacher[];
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  "create-task": {
    border: "1px black solid",
  },
}));

interface classList {
  classId: number;
  name: string;
  students: IStudent[];
}

export default function AddTask({
  task,
  index = 0,
  handleChange,
  handleRemove,
  students,
  teacherClasses,
}: addTaskProps) {
  const classes = useStyles();
  const [defaultTaskLabels, setDefaultTaskLabels] = useState<any[]>([]);

  //@ts-ignore
  const classList: classList[] | undefined = teacherClasses?.map(
    (cls: IClassOfTeacher) => {
      return {
        classId: cls.classId,
        name: cls.Class.name,
        students: cls.Class.Students,
      };
    }
  );

  const changer = (value: any, fieldToChange: string) => {
    handleChange(fieldToChange, index, value);
  };

  const removeTask = () => {
    handleRemove(index, "task");
  };

  const addLabel: (id: number, labelName: string) => void = (
    id: number,
    labelName: string
  ) => {
    task.TaskLabels?.push({
      labelId: id,
      Label: { name: labelName },
      Criteria: [],
    });
    changer(task.TaskLabels, "labels");
  };

  const removeLabel: (labelToRemove: string) => void = (
    labelToRemove: string
  ) => {
    const indexToRemove: number = task.TaskLabels!.findIndex(
      (label: Partial<ITaskLabel>) => label.Label?.name === labelToRemove
    );
    if (indexToRemove === -1) alert("label does not exist");
    else {
      const labelToRmv: Partial<ITaskLabel> = task.TaskLabels![indexToRemove];
      if (labelToRmv.id) {
        labelToRmv.toDelete = true;
      } else {
        task.TaskLabels?.splice(indexToRemove, 1);
      }
      changer(task.TaskLabels, "labels");
    }
  };

  const getLabels: (
    searchQuery: string | undefined
  ) => Promise<any[] | undefined> = async (searchQuery: string | undefined) => {
    try {
      const labels: ILabel[] = (
        await network.get(
          `/api/v1/label/all${searchQuery ? `?search=${searchQuery}` : ""}`
        )
      ).data;
      return labels.map((label: ILabel) => {
        return { label: label.name, value: label.id };
      });
    } catch (e) {
      console.log(e);
    }
  };

  const foramtDefaultLabels: (
    labels?: ITaskLabel[]
  ) => Array<{ label: string; value: number }> = (labels?: ITaskLabel[]) => {
    return labels
      ? labels.map((lbl: ITaskLabel) => ({
          label: lbl.Label?.name!,
          value: lbl.id!,
        }))
      : [];
  };

  const handleSCSChange: (data: any, actionMeta: any) => Promise<void> = async (
    data: any,
    actionMeta: any
  ) => {
    if (actionMeta.action === "create-option") {
      const newLabel: string = data[data.length - 1].label;
      const responseLabel: ILabel[] = (
        await network.post("/api/v1/label", [{ name: newLabel }])
      ).data;
      console.log(responseLabel);
      addLabel(responseLabel[0].id!, newLabel);
    } else {
      if (actionMeta.action === "select-option") {
        console.log(actionMeta);
        addLabel(actionMeta.option.value!, actionMeta.option.label);
      } else {
        if (!actionMeta.removedValue) return;
        removeLabel(actionMeta.removedValue.label);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const labels = await getLabels(undefined);
      if (labels) {
        setDefaultTaskLabels(labels);
      }
    })();
  }, []);

  console.log("UPDATE TASK");
  console.log(task);
  console.log("^^^^^^^^^^^^^^^^^");
  return (
    <Form
      key={index}
      className="create-task"
      style={{
        maxWidth: students ? "70vw" : "20vw",
      }}
    >
      <Tooltip title="Remove task" style={{ alignSelf: "flex-end" }}>
        <CloseIcon onClick={removeTask} />
      </Tooltip>

      {/* <InputLabel id='task-type-label' shrink={true} htmlFor='task-type-label' >Task Type</InputLabel> */}

      <FormControl
        id="task-type"
        variant="outlined"
        className={classes.formControl}
      >
        <InputLabel id="task-type-label">Task Type</InputLabel>
        <Select
          // id='task-type'
          labelId="task-type-label"
          id="task-type"
          label="task-type"
          required={true}
          style={selectStyle}
          value={task.type}
          variant="outlined"
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            changer(e.target.value, "type");
            changer(null, "externalId");
            changer(null, "externalLink");
          }}
        >
          <MenuItem value="manual">manual</MenuItem>
          <MenuItem value="challengeMe">challengeMe</MenuItem>
          <MenuItem value="fcc">fcc</MenuItem>
          <MenuItem value="quiz">quiz</MenuItem>
        </Select>
      </FormControl>

      <FormControl
        id="external"
        variant="outlined"
        className={classes.formControl}
      >
        {task.type === "manual" ? (
          <Input
            label="Link to task"
            variant="outlined"
            defaultValue={task.externalLink}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              changer(e.target.value, "externalLink");
            }}
            value={task.externalLink}
          />
        ) : (
          <ChallengeSelector
            type={task.type}
            selectedValue={task.externalId}
            changeValue={changer}
          />
        )}
      </FormControl>

      <FormControl
        id="task-title"
        variant="outlined"
        className={classes.formControl}
      >
        <Input
          label="Task title"
          // disabled={task.type === "manual" ? false : true}
          variant="outlined"
          value={task.title}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            changer(e.target.value, "title");
          }}
          required={true}
        />
      </FormControl>

      <FormControl
        id="task-description"
        variant="outlined"
        className={classes.formControl}
      >
        <TextField
          label="Task Description"
          variant="outlined"
          multiline
          value={task.body}
          defaultValue={task.body}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            changer(e.target.value, "body");
          }}
        />
      </FormControl>

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          className={classes.formControl}
          label="Due Date"
          // disableToolbar
          minDate={new Date()}
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          id="date-picker-inline"
          inputVariant="outlined"
          value={task.endDate}
          onChange={(e: Date | null) => handleChange("endDate", index, e)}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>

      <FormControl
        id="status"
        variant="outlined"
        className={classes.formControl}
      >
        <InputLabel id="task-status-label">Status</InputLabel>
        <Select
          defaultValue="Pick a Status"
          labelId="task-status-label"
          id="task-status"
          label="status"
          style={selectStyle}
          value={task.status}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            changer(e.target.value, "status");
          }}
          variant="outlined"
        >
          <MenuItem value={"active"}>active</MenuItem>
          <MenuItem value={"disabled"}>disabled</MenuItem>
        </Select>
      </FormControl>
      <LabelsContainer style={{ borderTop: "1px olid black" }}>
        <h4>Set labels</h4>
        <FormControl
          id="task-labels"
          variant="outlined"
          className={classes.formControl}
          style={{ width: "100%", margin: 0 }}
        >
          <SearchCreateSelect
            isMulti
            loadOptions={getLabels}
            onChange={handleSCSChange}
            defaultOptions={defaultTaskLabels}
            defaultValue={foramtDefaultLabels(task.TaskLabels as ITaskLabel[])}
          />

          {/* <TextField variant="outlined" label="Add Label" inputRef={labelField} />
          <Button onClick={handleLabelAdd}>Add</Button> */}
        </FormControl>
        {task.TaskLabels?.map(
          (l: Partial<ITaskLabel>) =>
            !l.toDelete && <LabelView label={l as ITaskLabel} />
        )}
      </LabelsContainer>
      {students && teacherClasses !== undefined ? (
        <ClassAccordion classes={classList!} updatePicks={changer} />
      ) : (
        "No Students To Pick From"
      )}
    </Form>
  );
}

const LabelsContainer = styled.div`
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  padding: 14px;
`;

const Input = styled(TextField)`
  margin-top: 5px;
  margin-bottom: 5px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  min-width: 220px;
  width: 60vw;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 7px;
  /* border:.8px double black; */
  box-shadow: 1px 2px 7px 0px rgba(0, 0, 0, 0.1);
  padding: 10px;
  /* background-color: rgba(0, 0, 0, 0.05); */
`;

const selectStyle = {
  marginTop: "5px",
  marginBottom: "5px",
};
