import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Button,
  Switch,
  FormControl,
} from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DeleteIcon from "@material-ui/icons/Delete";
import network from "../../../../../../helpers/network";
import {
  IFormExtended,
  IField,
  IOption,
} from "../../../../../../typescript/interfaces";
const useStyles = makeStyles((theme) => ({
  field: {
    margin: "0.5em 0",
    padding: "0.5em",
    backgroundColor: theme.palette.background.paper,
  },
  option: {
    display: "flex",
    alignItems: "center",
    padding: "0.5em 0",
    margin: "0.5em",
    minHeight: "2em",
  },
  pointer: {
    cursor: "pointer",
  },
  forbidden: {
    cursor: "not-allowed",
  },
  button: {
    minWidth: "8em",
  },
}));
interface IProps {
  index: number;
  fieldIndex: number;
  value: string;
  options: IOption[];
  isQuiz: boolean;
  register: any;
  deleteOption: (index: number) => void;
  changeOption: (
    index: number,
    fieldIndex: number,
    title?: string,
    isCorrect?: boolean
  ) => void;
  selectCorrectOption: (index: number) => void;
}
export default function Option({
  index,
  fieldIndex,
  value,
  options,
  register,
  isQuiz,
  changeOption,
  deleteOption,
  selectCorrectOption,
}: IProps) {
  const classes = useStyles();
  const { control } = useForm();
  const isCorrect = options[index].isCorrect;
  const isOnlyOne = options.length === 1;
  const onlyOneCorrect =
    options.filter((option) => option.isCorrect).length === 1;
  const ableToDelete = () =>
    (isQuiz && onlyOneCorrect && isCorrect) || isOnlyOne ? true : false;
  return (
    <>
      <div className={classes.option}>
        <input
          name={`fields[${fieldIndex}].options[${index}].title`}
          ref={register({ required: true })}
          placeholder={`option ${index + 1}`}
          onChange={(e) => {
            changeOption(index, fieldIndex, e.target.value || "", undefined);
          }}
          value={value}
        />
        {isQuiz && (
          <>
            {/* <Button
              onClick={() => {
                selectCorrectOption(index);
              }}
              // variant={'contained'}
              size={"small"}
              color={"primary"}
              className={classes.button}
            >
              {options[index].isCorrect ? "Correct" : "Wrong"}
            </Button> */}
            <Switch color={"primary"} inputRef={register} inputProps={{
              name: `fields[${fieldIndex}].options[${index}].isCorrect`
            }}/>
          </>
        )}
        {ableToDelete() && (
          <DeleteIcon
            onClick={() => {
              deleteOption(index);
            }}
            className={
              options[index].isCorrect ? classes.forbidden : classes.pointer
            }
          >
            Delete
          </DeleteIcon>
        )}
      </div>
    </>
  );
}
