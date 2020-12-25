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
  option: {
    display: "flex",
    alignItems: "center",
    // padding: "0.5em 0",
    margin: "0.5em 0",
    minHeight: "2.5em",
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
    (isQuiz && onlyOneCorrect && isCorrect) || isOnlyOne ? false : true;
  return (
    <>
      <div className={classes.option}>
        <input
          name={`fields[${fieldIndex}].options[${index}].title`}
          ref={register({ required: true })}
          placeholder={`option ${index + 1}`}
          onChange={(e) => {
            const title = e.target.value ? e.target.value : "";
            changeOption(index, fieldIndex, title, undefined);
          }}
          value={value}
        />
        {/* <button onClick={() => console.log(isCorrect)}>LOG</button> */}
        {(isQuiz && (options[index].isCorrect !== undefined)) && (
          <>
            {/* <Switch
              color={"default"}
              size={"small"}
              checked={options[index].isCorrect}
              inputRef={register}
              disabled={isOnlyOne || (onlyOneCorrect && isCorrect)}
              onChange={() => selectCorrectOption(index)}
              inputProps={{
                name: `fields[${fieldIndex}].options[${index}].isCorrect`,
              }}
            /> */}

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

            <Controller
              control={control}
              name={`fields[${fieldIndex}].options[${index}].isCorrect`}
              render={(
                // { onChange, onBlur, value, name, ref }, { invalid, isTouched, isDirty }
                ) => (
                <Switch
                  color={"secondary"}
                  size={"small"}
                  checked={options[index].isCorrect}
                  // inputRef={register}
                  disabled={isOnlyOne || (onlyOneCorrect && isCorrect)}
                  onChange={() => selectCorrectOption(index)}
                  // inputProps={{
                  //   name: `fields[${fieldIndex}].options[${index}].isCorrect`,
                  // }}
                />
              )}
            />
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
