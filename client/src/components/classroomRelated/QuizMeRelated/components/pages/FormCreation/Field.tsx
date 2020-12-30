import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Input,
  // Select
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import network from "../../../../../../helpers/network";
import {
  IFormExtended,
  IField,
  IOption,
} from "../../../../../../typescript/interfaces";
import Option from "./Option";
import { type } from "os";
const useStyles = makeStyles(() => ({
  field: {
    margin: "1em 0",
    padding: "1.5em",
    backgroundColor: "#d6e4ff",
    borderRadius: "3px",
  },
  fieldInput: {
    margin: "0.5em 0",
    backgroundColor: "rgba(255, 0, 0, 0)",
    border: 'none',
    borderBottom: '1px solid black'
  },
  select: {
    width: "14em",
    // height: "1em",
    fontSize: "0.75em",
    fontWeight: 600,
    display: "inline-block",
    margin: "0 0.75em",
  },
  horizontalMargin: {
    margin: "0 0.5em",
  },
  deleteFieldWrapper: {
    display: "flex",
    flexDirection: "row-reverse",
  },
  deleteField: {
    cursor: "pointer",
    position: "absolute",
  },
  addOption: {
    cursor: "pointer",
  }
}));
interface IProps {
  register: any;
  control: any;
  Controller: any;
  fieldIndex: number;
  title: string;
  typeId: number | undefined;
  typeIndex: number;
  isQuiz: boolean;
  changeField: (
    index: number,
    typeId?: number,
    // title?: string,
    options?: IOption[]
  ) => void;
  changeFieldTitle: (
    index: number,
    title: string
  ) => void;
  deleteField: (index: number) => void;
}
export default function Field({
  ////////// RFC
  register,
  control,
  Controller,
  fieldIndex,
  title,
  typeId,
  typeIndex,
  isQuiz,
  changeField,
  changeFieldTitle,
  deleteField,
}: IProps) {
  const classes = useStyles();
  const initialOptions = isQuiz
    ? [
        {
          title: "",
          isCorrect: true,
        },
        {
          title: "",
          isCorrect: false,
        },
        {
          title: "",
          isCorrect: false,
        },
        {
          title: "",
          isCorrect: false,
        },
      ]
    : [
        {
          title: "",
        },
        {
          title: "",
        },
        {
          title: "",
        },
        {
          title: "",
        },
      ];
  const [options, setOptions] = useState<IOption[]>([
    {
      title: "",
    },
    {
      title: "",
    },
    {
      title: "",
    },
    {
      title: "",
    },
  ]);
  useEffect(() => {
    isQuiz
      ? setOptions([
          {
            title: "",
            isCorrect: true,
          },
          {
            title: "",
            isCorrect: false,
          },
          {
            title: "",
            isCorrect: false,
          },
          {
            title: "",
            isCorrect: false,
          },
        ])
      : setOptions([
          {
            title: "",
          },
          {
            title: "",
          },
          {
            title: "",
          },
          {
            title: "",
          },
        ]);
  }, [isQuiz]);

  const fieldTypes = [
    { value: 1, label: "Select-One" },
    { value: 2, label: "Open Question" }
  ];
  const addOption = (e: any) => {
    e.preventDefault();
    const optionsArr = options.slice();
    optionsArr.push({
      title: "",
      isCorrect: false,
    });
    setOptions(optionsArr);
  };
  const deleteOption = (index: number) => {
    if (!options[index].isCorrect) {
      const optionArr = options.slice();
      optionArr.splice(index, 1);
      setOptions(optionArr);
    }
  };
  const changeOption = (
    index: number,
    fieldIndex: number,
    title?: string,
    isCorrect?: boolean | null
  ) => {
    const optionsArr = options.slice();
    if(title || title === "") {
      optionsArr[index].title = title;
    }
    setOptions(optionsArr);
    changeField(fieldIndex, undefined, optionsArr);
  };
  const selectCorrectOption = (correctOptionIndex: number) => {
    if (!options[correctOptionIndex].isCorrect) {
      let optionsArr = options.slice();
      optionsArr = optionsArr.map((option: IOption, index: number) =>
        index === correctOptionIndex
          ? { ...option, isCorrect: true }
          : { ...option, isCorrect: false }
      );
      setOptions(optionsArr);
      changeField(fieldIndex, undefined, optionsArr);
    }
  };
  
  return (
    <div className={classes.field}>
      <div className={classes.deleteFieldWrapper}>
        <DeleteIcon
          className={classes.deleteField}
          onClick={() => {
            deleteField(fieldIndex);
          }}
        />
      </div>
      <label htmlFor={`field[${fieldIndex}].title`}>
        Question #{fieldIndex + 1}
      </label>

      <Controller
        control={control}
        name={`fields[${fieldIndex}].typeId`}
        render={(
          { onChange, onBlur, value, name, ref }: any,
          { invalid, isTouched, isDirty }: any
        ) => (
          <Select
            onChange={(e) => {
              changeField(fieldIndex, e!.value);
            }}
            className={classes.select}
            options={fieldTypes}
            value={fieldTypes[typeIndex]}
            // getValue={() => fieldTypes.find(field => field.value === typeId)}
            inputRef={ref}
          />
        )}
      />

      {/* <Select
        options={fieldTypes}
        className={classes.select}
        // name={`fields[${fieldIndex}].typeId`}
        // ref={register}
        onChange={(e) => {
          console.log(e!.value);
          changeField(fieldIndex, Number(e!.value), undefined, options);
        }}
      /> */}

      {/* <select
        name={`fields[${fieldIndex}].typeId`}
        ref={register}
        onChange={(e) => {
          console.log(e.target.value);
          changeField(fieldIndex, Number(e.target.value), undefined, options);
        }}
      >
        <option value={2}>Open Question</option>
        <option value={1}>Select-One</option>
      </select> */}

      <div>
        {typeId === 2 ? ( // 2 is the typeId of openQuestion
          // OPEN QUESTION
        <Controller
          control={control}
          name={`fields[${fieldIndex}].title`}
          // defaultValue={''}
          render={(
           { onChange, onBlur, value, name, ref }: any,
           { invalid, isTouched, isDirty }: any
           ) => (
             <Input
                className={classes.fieldInput}
                fullWidth
                inputRef={ref}
                placeholder="Your Question"
                onBlur={onBlur}
                // onChange={(e) => {
                //   changeFieldTitle(fieldIndex, e.target.value)
                // }}
                onChange={(e) => {
                    onChange();
                    changeFieldTitle(fieldIndex, e.target.value);
                }}
                value={value}
             />
           )}
         />

          // <input // field title
          //   className={classes.fieldInput}
          //   ref={register({ required: true })}
          //   name={`fields[${fieldIndex}].title`}
          //   placeholder="Your Question"
          //   onChange={(e) => {
          //     changeFieldTitle(fieldIndex, e.target.value)
          //   }}
          //   value={title}
          // />
        ) : (
          // SELECT-ONE | CHECKBOX
          <>
            <Input // field title
              className={classes.fieldInput}
              fullWidth
              inputRef={register({ required: true })}
              name={`fields[${fieldIndex}].title`}
              placeholder="Your Question"
              onChange={(e) => {
                  changeFieldTitle(fieldIndex, e.target.value)
                }
              }
              value={title}
            />
            {options.map((
              option: IOption,
              index: number // OPTIONS
            ) => (
              <Option
                key={index}
                index={index}
                fieldIndex={fieldIndex}
                register={register}
                deleteOption={deleteOption}
                changeOption={changeOption}
                selectCorrectOption={selectCorrectOption}
                value={option.title}
                // isCorrect={option.isCorrect}
                isQuiz={isQuiz}
                options={options}
              />
            ))}
            <div>
              <AddCircleOutlineIcon
                // color={'primary'}
                // fontSize={'large'}
                className={classes.addOption}
                onClick={(e: any) => {
                  addOption(e);
                }}
              />
            </div>
          </>
        )}
      </div>
      {/* {errors["isQuiz"] && <span>This field is required</span>} */}
    </div>
  );
}
