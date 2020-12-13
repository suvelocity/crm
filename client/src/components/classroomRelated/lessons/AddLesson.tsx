import React, { useState } from "react";
import styled from "styled-components";
import { ILesson } from "../../../typescript/interfaces";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import network from "../../../helpers/network";

export default function AddLesson() {
  const [title, setTitle] = useState<string>("");

  return (
    <div>
      <TextField
        variant='outlined'
        label='Search'
        //   value={filter}
        //   onChange={handleFilter}
      />
    </div>
  );
}
