import React, { useState, useContext } from "react";
import styled from "styled-components";
import { ILesson } from "../../../typescript/interfaces";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import network from "../../../helpers/network";
import { AuthContext } from "../../../helpers";
import Swal from "sweetalert2";

export default function AddLesson({ setOpen }: { setOpen: any }) {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [zoomLink, setZoomLink] = useState<string>("");
  const [resource, setResource] = useState<string>("");
  const [resources, setResources] = useState<string[]>([]);

  //@ts-ignore
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const lessonToAdd: ILesson = {
        classId: user.classId,
        title,
        body,
        resource: resources.join("%#splitingResource#%"), //TODO change to json in sql
        zoomLink,
        createdBy: user.id,
      };
      const { data: addedLesson }: { data: ILesson } = await network.post(
        "/api/v1/lesson",
        lessonToAdd
      );
      setOpen(false);
    } catch (err) {
      Swal.fire("failed", err.message, "error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
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
    setResources((prev) => [resource, ...prev]);
    setResource("");
  };

  const handleRemove = (index: number): void => {
    const prevResources = resources.slice();
    prevResources.splice(index, 1);
    setResources(prevResources);
  };

  return (
    <AddLessonContainer>
      <AddRsourcesContainer onSubmit={handleSubmit}>
        <Input
          variant='outlined'
          label='Resource'
          value={resource}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, "resource")
          }
        />
        <AddResourceBtn onClick={handleAddResource}>
          Add Resource
        </AddResourceBtn>
      </AddRsourcesContainer>
      <AddLessonForm onSubmit={handleSubmit}>
        <Input
          variant='outlined'
          label='Lesson name'
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, "title")
          }
          aria-describedby='my-helper-text'
          required={true}
        />

        <Input
          variant='outlined'
          label='Lesson content'
          value={body}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, "body")
          }
          required={true}
        />
        <Input
          variant='outlined'
          label='Zoom link'
          value={zoomLink}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, "zoomLink")
          }
          required={true}
        />
        <Submit>Add Lesson</Submit>
      </AddLessonForm>
      <ResourcesLinks>
        {resources.map((resource: string, index: number) => (
          <ResourcesLink key={index} onClick={() => handleRemove(index)}>
            <Tooltip title='delete resource'>
              <Link>{resource}</Link>
            </Tooltip>
          </ResourcesLink>
        ))}
      </ResourcesLinks>
    </AddLessonContainer>
  );
}

const AddResourceBtn = styled(Button)`
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
`;

const ResourcesLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ResourcesLink = styled.div`
  margin-top: 15px;
`;

const Link = styled.span`
  background-color: #3f51b5;
  border-radius: 8px;
  padding: 5px;
  color: white;
`;
