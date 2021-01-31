import * as React from "react";
import { DataGrid, ColDef, ValueFormatterParams  } from "@material-ui/data-grid";
import Button from '@material-ui/core/Button';
import { Loading } from "react-loading-wrapper";
// import {Link} from 'react-dom'
import LinkIcon from "@material-ui/icons/Link";
import styled from "styled-components";
import { Center, StyledAtavLink } from "../../../styles/styledComponents";

const separateToValues = (dateTimeBigger: number, dateTimeSmaller: number) => {
  let diff = dateTimeBigger - dateTimeSmaller;
  const Minute = 1000 * 60;
  const HourInMs = Minute * 60;
  const dayInMs = HourInMs * 24;
  const weekInMs = dayInMs * 7;
  const array = [
    { value: weekInMs, name: "weeks" },
    { value: dayInMs, name: "days" },
    { value: HourInMs, name: "hours" },
    { value: Minute, name: "minutes" },
  ];
  const result = [];
  for (let i = 0; i < array.length && result.length < 2; i++) {
    const unit = array[i];
    const name = unit.name;
    let amount = Math.floor(diff / unit.value);
    if (amount > 0) {
      diff = diff - amount * unit.value;
      if (amount === 1) {
        result.push({ amount, name: name.slice(0, name.length - 1) });
      } else {
        result.push({ amount, name });
      }
    }
  }
  const whatToSend = `${result[0].amount} ${result[0].name} and ${result[1].amount} ${result[1].name}`;
  return whatToSend;
};
const manipulateDate = (date: string) => {
  const DateFromString = new Date(date);
  const dueDateTime = DateFromString.getTime();
  const timeNow = Date.now();
  const relevent = dueDateTime > timeNow;
  let returnVal;
  if (relevent) {
    returnVal = separateToValues(dueDateTime, timeNow);
  } else {
    returnVal = separateToValues(timeNow, dueDateTime);
  }
  return returnVal;
};

export default function DataGridDemo(props: any) { //
  const [loading, setLoading] = React.useState<boolean>(true);
  const { myTasks } = props;
  const columns: ColDef[] = [
    // { field: "taskId", headerName: "#", width: 50 },
    { field: "taskName", headerName: "Task", width: 200 },
    { field: "lesson", headerName: "Lesson", width: 150 },
    { field: "type", headerName: "Type", width: 90 },
    {
      field: "deadline",
      headerName: "Deadline",
      type: "string",
      width: 110,
    },
    {
      field: "link",
      headerName: "External Link",
      type: "string",
      flex: 500,
    },
    {
      field: "submitLink",
      headerName: "URL Submitted",
      renderCell: (params: ValueFormatterParams) => (
        <strong>
          {params.value }
          {params.row.type === 'manual' &&        
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => {
                console.log(params);
                props.ReSubmit({...params.row, title : params.row.taskName})
              }}
              style={{ marginLeft: 16 }}
            >
              update
            </Button>
          }
        </strong>
      ),
      flex: 400,
    },
  ];
  const rows =
    myTasks?.map((task: any) => {
      return {
        id: task.id,
        taskId: task.Task.id,
        taskName: task.Task.title,
        lesson: task.Task?.Lesson?.title || "not in a lesson",
        type: task.Task.type,
        // deadline: manipulateDate(task.Task.endDate), //.split("T").join(" At ").slice(0, 19),
        deadline: task.Task.endDate.substring(0, 10),
        link: task.Task.externalLink,
        // renderCell: <button>hello</button>,
        // status: task.status,
        submitLink: task.submitLink,
      };
    }) || [];

  return (
    <TaskTableConatiner>
      <div style={{ height: 630, width: "100%", color: "white" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          checkboxSelection={false}
        />
      </div>
    </TaskTableConatiner>
  );
}

const TaskTableConatiner = styled.div`
  /* color: ${({ theme }: { theme: any }) => theme.colors.font}; */
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  /* background: "#d3d4d5"; */
  height: 70vh;
  width: 90%;
  overflow: hidden;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
`;
