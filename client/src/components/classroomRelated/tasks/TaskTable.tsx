import * as React from "react";
import { DataGrid, ColDef } from "@material-ui/data-grid";
import network from "../../../helpers/network";
import Swal from "sweetalert2";
import { Loading } from "react-loading-wrapper";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Submit from "./Submit";

const columns: ColDef[] = [
  { field: "taskId", headerName: "#", width: 50 },
  { field: "taskName", headerName: "Task", flex: 1 },
  { field: "lesson", headerName: "Lesson", flex: 1 },
  { field: "type", headerName: "Type", width: 100 },
  {
    field: "endDate",
    headerName: "Deadline",
    type: "date",
    width: 300,
  },
  {
    field: "link",
    headerName: "External Link",
    type: "date",
    flex: 1,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
  },
  {
    field: "submitLink",
    headerName: "URL Submitted",
    width: 300,
  },
];

export default function DataGridDemo(props: any) {
  const [selection, setSelection] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const { myTasks } = props;

  const rows =
    myTasks?.map((task: any) => {
      return {
        id: task.id,
        taskId: task.Task.id,
        taskName: task.Task.body,
        lesson: task.Task.Lesson.title,
        type: task.Task.type,
        deadline: task.Task.endDate,
        status: task.status,
        submitLink: task.submitLink,
      };
    }) || [];

  const handleOpen = () => {
    if (selection.length !== 1) {
      alert("please select one task");
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Submit taskId={selection[0]} handleClose={handleClose} />
    </div>
  );

  return (
    <div>
      <div style={{ height: 630, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          onSelectionChange={(newSelection) => {
            setSelection(newSelection.rowIds);
          }}
          checkboxSelection={false}
        />
      </div>
      <div>
        <Button
          variant='outlined'
          onClick={handleOpen}
          disabled={selection.length === 1 ? false : true}
          color={selection.length === 1 ? "secondary" : "default"}>
          Submit selected task
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'>
          {body}
        </Modal>
      </div>
    </div>
  );
}

//*modal

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);
