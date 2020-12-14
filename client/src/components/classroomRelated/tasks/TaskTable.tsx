import * as React from "react";
import { DataGrid, ColDef, ValueGetterParams } from "@material-ui/data-grid";

const columns: ColDef[] = [
  { field: "id", headerName: "#", width: 70 },
  { field: "taskName", headerName: "Task", width: 300 },
  { field: "lesson", headerName: "Lesson", width: 200 },
  {
    field: "endDate",
    headerName: "Deadline",
    type: "date",
    width: 90,
  },
  {
    field: "link",
    headerName: "External Link",
    type: "date",
    width: 300,
  },
  {
    field: "status",
    headerName: "Status",
    width: 90,
  },
];

// const rows = [
//   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
//   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
//   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
//   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
//   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
//   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
//   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
//   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
//   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
// ];

export default function DataGridDemo(props: any) {
  const { myTasks } = props;

  console.log(myTasks);

  const rows =
    myTasks?.map((task: any) => {
      return {
        id: task.Task.id,
        taskName: task.Task.body,
        lesson: task.Task.Lesson.title,
        deadline: task.Task.endDate,
        status: task.status,
      };
    }) || [];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection />
    </div>
  );
}
