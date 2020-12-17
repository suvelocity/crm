import React, { useState } from "react";
import styled from "styled-components";
import { ILesson } from "../../typescript/interfaces";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import network from "../../../helpers/network";

// id: 10,
// classId: 1,
// title: "hello sonnnnnn",
// body: "redux by nirrrrrr",
// resource:
//   "http://www.myAss.com%#splitingResource#%http://yourAss.com",
// zoomLink: "http://www.zoomAss.com",
// createdBy: 1,

export default function AddLesson() {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [zoomLink, setZoomLink] = useState<string>("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setTitle(value);
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setBody(value);
  };

  const handleZoomLink = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setZoomLink(value);
  };

  return (
    <div>
      <form>
        <TextField
          variant='outlined'
          label='Lesson name'
          value={title}
          onChange={handleTitleChange}
          aria-describedby='my-helper-text'
          required={true}
        />

        <TextField
          variant='outlined'
          label='Lesson content'
          value={body}
          onChange={handleBodyChange}
          required={true}
        />
        <TextField
          variant='outlined'
          label='Zoom link'
          value={zoomLink}
          onChange={handleZoomLink}
          required={true}
        />
        <button>hi</button>
      </form>
    </div>
  );
}
