import * as React from "react";
import { DataGrid, ColDef } from "@material-ui/data-grid";
import { Loading } from "react-loading-wrapper";
import styled from "styled-components";

const columns: ColDef[] = [
  { field: "taskId", headerName: "#", width: 50 },
  { field: "taskName", headerName: "Task", flex: 1 },
  { field: "lesson", headerName: "Lesson", flex: 1 },
  { field: "type", headerName: "Type", width: 100 },
  {
    field: "deadline",
    headerName: "Deadline",
    type: "string",
    width: 300,
  },
  {
    field: "link",
    headerName: "External Link",
    type: "string",
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
export default function DataGridDemo(props: any) {
  const [loading, setLoading] = React.useState<boolean>(true);
  const { myTasks } = props;

  const rows =
    myTasks?.map((task: any) => {
      return {
        id: task.id,
        taskId: task.Task.id,
        taskName: task.Task.body,
        lesson: task.Task?.Lesson?.title || "not in a lesson",
        type: task.Task.type,
        deadline: manipulateDate(task.Task.endDate), //.split("T").join(" At ").slice(0, 19),
        link: task.Task.externalLink,
        status: task.status,
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
  /* background-color: ${({ theme }: { theme: any }) =>
    theme.colors.background}; */
  height: 70vh;
  width: 70%;
  overflow: hidden;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
`;
