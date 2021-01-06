import React, { useState, useContext, ChangeEvent } from "react";
import { ILesson, ITask } from "../../../typescript/interfaces";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import "../../../App.css";
import network from "../../../helpers/network";
import { AuthContext } from "../../../helpers";
import Swal from "sweetalert2";
import AddTask from "./AddTask";
import CloseIcon from "@material-ui/icons/Close";

interface Props {
  setOpen: Function;
  handleClose?: Function;
  update?: boolean;
  lesson?: ILesson;
  header?: string;
  lessonAdded?: Function;
  lessonTasks?: ITask[];
  classId: number;
}
export default function AddLesson({
  setOpen,
  update,
  lesson,
  header,
  handleClose,
  lessonAdded,
  lessonTasks,
  classId,
}: Props) {
  const [title, setTitle] = useState<string>(lesson ? lesson.title : "");
  const [body, setBody] = useState<string>(lesson ? lesson.body : "");
  const [tasksToDelete, setTasksToDelete] = useState<ITask[]>([]);
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
  const [tasks, setTasks] = useState<ITask[]>(lessonTasks ? lessonTasks : []);

  //@ts-ignore
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lessonToAdd: ILesson = {
        classId,
        title,
        body,
        resource: resources.join("%#splitingResource#%"), //TODO change to json in sql
        zoomLink,
        createdBy: user.id,
      };
      if (update && lesson) {
        await network.put(`/api/v1/lesson/${lesson.id}`, lessonToAdd);
        const tasksToUpdate = tasks
          .slice()
          .filter((task) => task.hasOwnProperty("id"));
        await Promise.all(
          tasksToUpdate.map((task) => {
            const taskId = task.id;
            const taskToSend = { ...task };
            delete taskToSend.id;
            delete taskToSend.createdAt;
            delete taskToSend.updatedAt;
            delete taskToSend.deletedAt;
            return network.patch(`/api/v1/task/${taskId}`, taskToSend);
          })
        );
        const tasksToAdd = tasks.filter((task) => !task.hasOwnProperty("id"));
        await Promise.all(
          tasksToAdd.map((task) => {
            const taskWithLessonId = { ...task, lessonId: lesson.id };
            return network.post(
              `/api/v1/task/toclass/${classId}`,
              taskWithLessonId
            );
          })
        );
        await Promise.all(
          tasksToDelete.map((task) => network.delete(`/api/v1/task/${task.id}`))
        );
        handleClose && handleClose();
      } else {
        const { data: addedLesson }: { data: ILesson } = await network.post(
          "/api/v1/lesson",
          lessonToAdd
        );

        await Promise.all(
          tasks.map((task) => {
            const taskWithLessonId = { ...task, lessonId: addedLesson.id };
            return network.post(
              `/api/v1/task/toclass/${classId}`,
              taskWithLessonId
            );
          })
        );
        // handleClose && handleClose();
        Swal.fire("Success", "lesson added :)", "success").then(
          (_) => lessonAdded && lessonAdded()
        );

        setOpen(false);
      }
    } catch (err) {
      Swal.fire("failed", err.message, "error");
    }
  };

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
        const toDelete = prevTasks.splice(index, 1)[0];
        if (toDelete.hasOwnProperty("id")) {
          const updateDeleted = tasksToDelete.slice();
          updateDeleted.push(toDelete);
          setTasksToDelete(updateDeleted);
        }
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
        externalLink: "",
        externalId: "",
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
      case "externalId":
        prevTasks[index].externalId = change;
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
          label="Lesson name"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, "title")
          }
          aria-describedby="my-helper-text"
          required={true}
          variant="outlined"
        />

        <Input
          label="Lesson content"
          variant="outlined"
          value={body}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, "body")
          }
          required={true}
          multiline
        />
        <Input
          label="Zoom link"
          value={zoomLink}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, "zoomLink")
          }
          variant="outlined"
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
          <ResourceBtn
            variant="outlined"
            onClick={handleAddResource}
            style={{ marginLeft: "15px" }}
          >
            Add Resource
          </ResourceBtn>
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

        <Info
          className={tasks.length && "open"}
          style={{ marginBottom: "10%" }}
        >
          <AddBtn variant="outlined" onClick={addTask}>
            Add Task
          </AddBtn>
          {tasks.map((task: ITask, index: number) => (
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
      <CreateLessonButton
        variant="outlined"
        onClick={handleSubmit}
        // style={{

        //   position:"absolute",
        //   bottom:'5%',
        //   left:'50%',
        //   transform:'translate(-50%)',
        //   marginTop: "auto",
        //   backgroundColor: "white",
        //   boxShadow:' 0 0 8px 2px rgba(0,0,0,.1)'
        // }}
      >
        {header ? header : "Create Lesson"}
      </CreateLessonButton>
    </AddLessonContainer>
  );
}
const AddBtn = styled(Button)`
  transition: 1.5sec;
  align-self: center;
  margin: 5px;
  margin-top: 50px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  min-width: fit-content;
`;
const ResourceBtn = styled(Button)`
  transition: 1sec;
  align-self: center;
  margin: 5px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  min-width: fit-content;
`;
const CreateLessonButton = styled(Button)`
  position: absolute;
  width: fit-content;
  bottom: 2%;
  left: 50%;
  transform: translate(-50%);
  margin-top: auto;

  background-color: #fefefe;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.1);
`;

const Input = styled(TextField)`
  margin-bottom: 10px;
`;

const AddRsourcesContainer = styled.div`
  display: flex;
  align-items: center;
`;

const AddLessonContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* background-color: ${({ theme }: { theme: any }) => theme.colors.container};
  color: white; */
  padding: 20px;
`;

const AddLessonForm = styled.form`
  display: flex;
  flex-direction: column;
  height: 80vh;
  /* width: 80vw; */
  min-width: 300px;
  overflow-y: scroll;
  padding: 5px;
`;

const Info = styled.div`
  &.open {
    height: 110%;
    transition: 1sec;
    margin-bottom: 10%;
  }
  height: 5%;
  min-height: fit-content;
  //TODO rename
  display: flex;
  transition: 0.5s;
  /* flex-direction: column; */
  align-items: flex-start;
  /* overflow-x: auto; */
`;

const OneInfo = styled.div`
  //TODO rename
  margin-top: 10px;
  padding: 10px;
  margin-right: 15px;
`;

const Link = styled.span`
  background-color: #0a1425;
  border-radius: 8px;
  padding: 5px;
  color: white;
`;
