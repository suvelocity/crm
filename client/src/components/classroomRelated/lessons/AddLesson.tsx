import React, { useState, useContext, ChangeEvent } from "react";
import styled from "styled-components";
import { ILesson } from "../../../typescript/interfaces";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import network from "../../../helpers/network";
import { AuthContext } from "../../../helpers";
import Swal from "sweetalert2";
import AddTask from "./AddTask";
interface Task {
  lessonId?: number;
  externalId?: number;
  externalLink?: string;
  createdBy: number;
  endDate: Date;
  type: string;
  title: string;
  body?: string;
  status: "active" | "disabled";
}

interface Props {
  setOpen: Function;
  handleClose?: Function;
  update?: boolean;
  lesson?: ILesson;
  header?: string;
}
export default function AddLesson({
  setOpen,
  update,
  lesson,
  header,
  handleClose,
}: Props) {
  const [title, setTitle] = useState<string>(lesson ? lesson.title : "");
  const [body, setBody] = useState<string>(lesson ? lesson.body : "");
  const [zoomLink, setZoomLink] = useState<string>(
    lesson ? (lesson.zoomLink ? lesson.zoomLink : "") : ""
  );
  const [resource, setResource] = useState<string>("");
  const [resources, setResources] = useState<string[]>(
    lesson
      ? lesson.resource
        ? lesson.resource.split("%#splitingResource#%")
        : []
      : []
  );
  const [tasks, setTasks] = useState<Task[]>([]);

  //@ts-ignore
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lessonToAdd: ILesson = {
        classId: Number(user.classId),
        title,
        body,
        resource: resources.join("%#splitingResource#%"), //TODO change to json in sql
        zoomLink,
        createdBy: user.id,
      };
      if (update && lesson) {
        await network.put(`/api/v1/lesson/${lesson.id}`, lessonToAdd);
        handleClose && handleClose();
      } else {
        const { data: addedLesson }: { data: ILesson } = await network.post(
          "/api/v1/lesson",
          lessonToAdd
        );

        tasks.forEach(async (task) => {
          const taskWithLessonId = { ...task, lessonId: addedLesson.id };
          console.log(taskWithLessonId);

          await network.post(
            `/api/v1/task/toclass/${user.classId}`,
            taskWithLessonId
          );
        });
        setOpen(false);
      }
    } catch (err) {
      Swal.fire("failed", err.message, "error");
    }
  };
  console.log(tasks);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    name: string
  ): void => {
    const { value } = e.target;
    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "body":
        setBody(value);
        break;
      case "zoomLink":
        setZoomLink(value);
        break;
      case "resource":
        setResource(value);
        break;
    }
  };

  const handleAddResource = () => {
    if (resource.length > 0) {
      setResources((prev) => [resource, ...prev]);
      setResource("");
    }
  };

  const handleRemove = (index: number, name: string): void => {
    switch (name) {
      case "resource":
        const prevResources = resources.slice();
        prevResources.splice(index, 1);
        setResources(prevResources);
        break;
      case "task":
        const prevTasks = tasks.slice();
        prevTasks.splice(index, 1);
        setTasks(prevTasks);
        break;
    }
  };

  const addTask = () => {
    setTasks((prev) => [
      {
        body: "",
        createdBy: user.id,
        type: "manual",
        endDate: new Date(),
        title: "",
        status: "active",
      },
      ...prev,
    ]);
  };

  const handleTaskChange = (element: string, index: number, change: any) => {
    const prevTasks = tasks.slice();
    switch (element) {
      case "title":
        prevTasks[index].title = change;
        setTasks(prevTasks);
        break;
      case "date":
        prevTasks[index].endDate = change;
        setTasks(prevTasks);
        break;
      case "externalLink":
        prevTasks[index].externalLink = change;
        setTasks(prevTasks);
        break;
      case "type":
        prevTasks[index].type = change;
        setTasks(prevTasks);
        break;
      case "body":
        prevTasks[index].body = change;
        setTasks(prevTasks);
        break;
      case "endDate":
        prevTasks[index].endDate = change;
        setTasks(prevTasks);
        break;
      case "status":
        prevTasks[index].status = change;
        setTasks(prevTasks);
        break;
    }
  };

  return (
    <AddLessonContainer>
      <AddLessonForm onSubmit={handleSubmit}>
        <Input
          variant="outlined"
          label="Lesson name"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, "title")
          }
          aria-describedby="my-helper-text"
          required={true}
        />

        <Input
          variant="outlined"
          label="Lesson content"
          value={body}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, "body")
          }
          required={true}
          multiline
        />
        <Input
          variant="outlined"
          label="Zoom link"
          value={zoomLink}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, "zoomLink")
          }
        />
        <AddRsourcesContainer onSubmit={handleSubmit}>
          <Input
            variant="outlined"
            label="Resource"
            value={resource}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e, "resource")
            }
          />
          <AddBtn onClick={handleAddResource}>Add Resource</AddBtn>
        </AddRsourcesContainer>
        <Info>
          {resources.map((resource: string, index: number) => (
            <OneInfo
              key={index}
              onClick={() => handleRemove(index, "resource")}
            >
              <Tooltip title="delete resource">
                <Link>{resource}</Link>
              </Tooltip>
            </OneInfo>
          ))}
        </Info>
        <AddBtn onClick={addTask}>Add Task</AddBtn>
        <Info>
          {tasks.map((task: Task, index: number) => (
            <OneInfo key={index}>
              <AddTask
                handleChange={handleTaskChange}
                task={task}
                index={index}
                handleRemove={handleRemove}
              />
            </OneInfo>
          ))}
        </Info>
      </AddLessonForm>
      <Submit onClick={handleSubmit}>
        {header ? header : "Create Lesson"}
      </Submit>
    </AddLessonContainer>
  );
}

const AddBtn = styled(Button)`
  margin-left: 20px;
`;

const Input = styled(TextField)`
  margin-bottom: 10px;
`;

const AddRsourcesContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Submit = styled.button`
  padding: 10px;
`;

const AddLessonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddLessonForm = styled.form`
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 80vw;
  overflow-y: scroll;
`;

const Info = styled.div`
  //TODO rename
  display: flex;
  /* flex-direction: column; */
  align-items: flex-start;
`;

const OneInfo = styled.div`
  //TODO rename
  margin-top: 15px;
  padding: 10px;
  margin-right: 15px;
`;

const Link = styled.span`
  background-color: #3f51b5;
  border-radius: 8px;
  padding: 5px;
  color: white;
`;
