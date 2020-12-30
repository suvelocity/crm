import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Input,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import network from "../../../../../../helpers/network";
import {
  IFormExtended,
  IField,
  IFieldExtended,
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
    // border: 'none',
    // borderBottom: '1px solid black'
  },
  select: {
    // width: "14em",
    // height: "1em",
    // fontSize: "0.75em",
    // fontWeight: 600,
    // display: "inline-block",
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
  },
}));
interface IProps {
  // register: any;
  // control: any;
  // Controller: any;
  fieldIndex: number;
  // title: string;
  // typeId: number;
  field: Omit<IFieldExtended, "id" | "formId">;
  options: IOption[] | undefined;
  typeIndex: number;
  isQuiz: boolean;
  changeFieldType: (
    index: number,
    type: string,
  ) => void;
  changeFieldOptions: (
    index: number,
    options: IOption[] | undefined
  ) => void;
  changeFieldTitle: (index: number, title: string) => void;
  deleteField: (index: number) => void;
}
export default function Field({
  ////////// RFC
  // register,
  // control,
  // Controller,
  fieldIndex,
  // title,
  // typeId,
  field,
  options,
  typeIndex,
  isQuiz,
  changeFieldType,
  changeFieldOptions,
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
  // const [options, setOptions] = useState<IOption[]>([
  //   {
  //     title: "",
  //   },
  //   {
  //     title: "",
  //   },
  //   {
  //     title: "",
  //   },
  //   {
  //     title: "",
  //   },
  // ]);
  // useEffect(() => {
  //   const newOptionsArray = isQuiz ? [
  //         {
  //           title: "",
  //           isCorrect: true,
  //         },
  //         {
  //           title: "",
  //           isCorrect: false,
  //         },
  //         {
  //           title: "",
  //           isCorrect: false,
  //         },
  //         {
  //           title: "",
  //           isCorrect: false,
  //         },
  //       ]
  //     : [
  //         {
  //           title: "",
  //         },
  //         {
  //           title: "",
  //         },
  //         {
  //           title: "",
  //         },
  //         {
  //           title: "",
  //         },
  //       ];
  //       // changeFieldOptions(fieldIndex, newOptionsArray);
  // }, [isQuiz]);

  const getOptions = () => isQuiz ? [
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

  const fieldTypes = [
    { value: 1, label: "Select-One" },
    { value: 2, label: "Open Question" },
  ];
  const addOption = (e: any) => {
    e.preventDefault();
    const optionsArr = options!.slice();
    optionsArr.push({
      title: "",
      isCorrect: false,
    });
    // setOptions(optionsArr);
    changeFieldOptions(fieldIndex, optionsArr);
  };
  const deleteOption = (index: number) => {
    if (!options![index].isCorrect) {
      const optionsArr = options!.slice();
      optionsArr.splice(index, 1);
      // setOptions(optionsArr);
      changeFieldOptions(fieldIndex, optionsArr);
    }
  };
  
  const changeOptionTitle = (
    index: number,
    fieldIndex: number,
    title: string,
  ) => {
    const optionsArr = options!.slice();
    optionsArr[index].title = title;
    // setOptions(optionsArr);
    changeFieldOptions(fieldIndex, optionsArr);
  };
  const changeOptionIsCorrect = (
    index: number,
    fieldIndex: number,
    isCorrect: boolean | null
  ) => {
    const optionsArr = options!.slice();
    if(isCorrect) {
      optionsArr[index].isCorrect = isCorrect;
    } else {
      optionsArr[index] = {
        title: optionsArr[index].title,
      };
    }
    // setOptions(optionsArr);
    changeFieldOptions(fieldIndex, optionsArr);
  };
  
  const selectCorrectOption = (correctOptionIndex: number) => {
    if (!options![correctOptionIndex].isCorrect) {
      let optionsArr = options!.slice();
      optionsArr = optionsArr.map((option: IOption, index: number) =>
        index === correctOptionIndex
          ? { ...option, isCorrect: true }
          : { ...option, isCorrect: false }
      );
      // setOptions(optionsArr);
      changeFieldOptions(fieldIndex, optionsArr);
    }
  };
  const getFieldType = (): string => {
    switch (field.typeId) {
      case 1:
        return "Select-One";
        break;
      case 2:
        return "Open-Question";
        break;
      default:
        return "Open-Question";
        break;
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

      {/* <Controller
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
            inputRef={ref}
          />
        )}
      /> */}
      <FormControl>
        <Select
          // options={fieldTypes}
          className={classes.select}
          // name={`fields[${fieldIndex}].typeId`}
          // ref={register}
          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
            changeFieldType(fieldIndex, e.target.value as string);
            if(e.target.value === 1) {
              changeFieldOptions(fieldIndex, getOptions());
            }
            if(e.target.value === 2) {
              changeFieldOptions(fieldIndex, undefined);
            }
          }}
          value={field.typeId}
        >
          <MenuItem value={2}>Open-Question</MenuItem>
          <MenuItem value={1}>Select-One</MenuItem>
        </Select>
      </FormControl>

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
        {field.typeId === 2 ? ( // 2 is the typeId of openQuestion
          // OPEN QUESTION
          // <Controller
          //   name={`fields[${fieldIndex}].title`}
          //   // defaultValue={''}
          //   render={(
          //    { onChange, onBlur, value, name, ref }: any,
          //    { invalid, isTouched, isDirty }: any
          //    ) => (
          //      <Input
          //         className={classes.fieldInput}
          //         fullWidth
          //         inputRef={ref}
          //         placeholder="Your Question"
          //         onBlur={onBlur}
          //         // onChange={(e) => {
          //         //   changeFieldTitle(fieldIndex, e.target.value)
          //         // }}
          //         onChange={(e) => {
          //             onChange();
          //             changeFieldTitle(fieldIndex, e.target.value);
          //         }}
          //         value={value}
          //      />
          //    )}
          //  />

          <Input
            className={classes.fieldInput}
            fullWidth
            //  inputRef={ref}
            placeholder="Your Question"
            onChange={(e) => {
              changeFieldTitle(fieldIndex, e.target.value);
            }}
            value={field.title}
          />
        ) : (
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
          // SELECT-ONE | CHECKBOX
          <>
            <Input // field title
              className={classes.fieldInput}
              fullWidth
              // inputRef={register({ required: true })}
              // name={`fields[${fieldIndex}].title`}
              placeholder="Your Question"
              onChange={(e) => {
                changeFieldTitle(fieldIndex, e.target.value);
              }}
              value={field.title}
            />
            {options && options.map((
              option: IOption,
              optionIndex: number // OPTIONS
            ) => (
              <Option
                key={optionIndex}
                optionIndex={optionIndex}
                fieldIndex={fieldIndex}
                // register={register}
                deleteOption={deleteOption}
                changeOptionTitle={changeOptionTitle}
                // changeOptionIsCorrect={changeOptionIsCorrect}
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
