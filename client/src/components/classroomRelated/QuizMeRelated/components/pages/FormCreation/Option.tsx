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
  FormControlLabel,
  Input
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
    margin: '0 0.4em'
  },
  forbidden: {
    cursor: "not-allowed",
    margin: '0 0.4em'
  },
  button: {
    minWidth: "8em",
  },
}));
interface IProps {
  optionIndex: number;
  fieldIndex: number;
  value: string;
  options: IOption[];
  isQuiz: boolean;
  // register: any;
  deleteOption: (index: number) => void;
  changeOptionTitle: (
    optionIndex: number,
    fieldIndex: number,
    title: string,
  ) => void;
  // changeOptionIsCorrect: (
  //   index: number,
  //   fieldIndex: number,
  //   isCorrect?: boolean
  // ) => void;
  selectCorrectOption: (index: number) => void;
}
export default function Option({
  optionIndex,
  fieldIndex,
  value,
  options,
  // register,
  isQuiz,
  changeOptionTitle,
  // changeOptionIsCorrect,
  deleteOption,
  selectCorrectOption,
}: IProps) {
  const classes = useStyles();
  const { control } = useForm();
  const isCorrect = options[optionIndex].isCorrect;
  const isOnlyOne = options.length === 1;
  const onlyOneCorrect =
    options.filter((option) => option.isCorrect).length === 1;
  const ableToDelete = () =>
    (isQuiz && onlyOneCorrect && isCorrect) || isOnlyOne ? false : true;
  return (
    <>
      <div className={classes.option}>
        <Input
          name={`fields[${fieldIndex}].options[${optionIndex}].title`}
          // inputRef={register({ required: true })}
          placeholder={`option ${optionIndex + 1}`}
          onChange={(e) => {
            const title = e.target.value ? e.target.value : "";
            changeOptionTitle(optionIndex, fieldIndex, title);
          }}
          value={value}
        />
        {/* <button onClick={() => console.log(isCorrect)}>LOG</button> */}
        {(isQuiz) && (
          // options[optionIndex].isCorrect !== undefined
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
            <FormControlLabel
              labelPlacement="start"
              control={<Switch 
                          checked={options[optionIndex].isCorrect}
                          onChange={() => selectCorrectOption(optionIndex)}
                          // inputRef={register} 
                          name={`fields[${fieldIndex}].options[${optionIndex}].isCorrect`} 
                      />}
              label="Correct?"
            />

            {/* <Controller
              control={control}
              name={`fields[${fieldIndex}].options[${index}].isCorrect`}
              render={() => (

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
            /> */}
          </>
        )}
        {ableToDelete() && (
          <DeleteIcon
            onClick={() => {
              deleteOption(optionIndex);
            }}
            className={
              options[optionIndex].isCorrect ? classes.forbidden : classes.pointer
            }
          >
            Delete
          </DeleteIcon>
        )}
      </div>
    </>
  );
}
