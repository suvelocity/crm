import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
} from "@material-ui/core";
import network from "../../../../../../helpers/network";
import { IFormExtended, IField, IOption } from "../../../../../../typescript/interfaces";
import Option from "./Option"
const useStyles = makeStyles((theme) => ({
  field: {
    margin: "1em 0",
    padding: "1.5em",
    backgroundColor: theme.palette.background.paper,
  },
}));
interface IProps {
  register: any;
  fieldIndex: number;
  value: string;
  typeId: number | undefined,
  isQuiz: boolean
  changeField: (index: number, typeId?: number, title?: string, options?: IOption[]) => void;
  deleteField: (index: number) => void;
}
export default function Field({ ////////// RFC
  register,
  fieldIndex,
  value,
  typeId,
  isQuiz,
  changeField,
  deleteField,
}: IProps) {
  const classes = useStyles();
  const initialOptions = isQuiz ? [
      {
        title: "",
        isCorrect: true
      },
      {
        title: "",
        isCorrect: false
      },
      {
        title: "",
        isCorrect: false
      },
      {
        title: "",
        isCorrect: false
      }
    ] : [
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
      }
    ]
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
    }
  ]);
  useEffect(() => {
    isQuiz ? setOptions([
      {
        title: "",
        isCorrect: true
      },
      {
        title: "",
        isCorrect: false
      },
      {
        title: "",
        isCorrect: false
      },
      {
        title: "",
        isCorrect: false
      }
    ]) : setOptions([
      {
        title: ""
      },
      {
        title: ""
      },
      {
        title: ""
      },
      {
        title: ""
      }
    ])
  }, [isQuiz]);

  const addOption = () => {
    const optionsArr = options.slice();
    optionsArr.push({
      title: "",
      isCorrect: false
    });
    setOptions(optionsArr)
  };
  const deleteOption = (index: number) => {
    if(!options[index].isCorrect) {
      const optionArr = options.slice();
      optionArr.splice(index, 1);
      setOptions(optionArr);
    }
  };
  const changeOption = (index: number, fieldIndex: number, title?: string, isCorrect?: boolean | null) => {
    const optionsArr = options.slice();
    optionsArr[index].title = (title || title === "") ? title : options[index].title;
    setOptions(optionsArr);
    changeField(fieldIndex, undefined, undefined, optionsArr);
  };
  const selectCorrectOption = (correctOptionIndex: number) => {
    console.log("this option: ", options[correctOptionIndex].isCorrect);
    if(!options[correctOptionIndex].isCorrect) {
      let optionsArr = options.slice();
      optionsArr = optionsArr.map((option: IOption, index: number) => (
        (index === correctOptionIndex) ? {...option, isCorrect: true} : {...option, isCorrect: false}
      ));
      setOptions(optionsArr);
      changeField(fieldIndex, undefined, undefined, optionsArr);
    } 
  };
  return (
    <div className={classes.field}>
      <label htmlFor={`field[${fieldIndex}].title`}>
        Question number {fieldIndex + 1}
      </label>
      <select // SELECT FIELD TYPE 
        name={`fields[${fieldIndex}].typeId`}
        ref={register}
        onChange={(e) => {
          console.log(e.target.value)
          changeField(fieldIndex, Number(e.target.value), undefined, options);
        }}
      >
        <option value={2}>Open Question</option> {/* FIELD TYPE OPTIONS*/}
        <option value={1}>Select-One</option>
        {/* <option value={3}>Checkbox</option> */}
      </select>
      <div>
        {typeId === 2 ? ( // 2 is the typeId of openQuestion
          // OPEN QUESTION 
          <input // field title
            ref={register({ required: true })}
            name={`fields[${fieldIndex}].title`}
            placeholder="Your Question"
            onChange={(e) => changeField(fieldIndex, undefined, e.target.value)}
            value={value}
          />
        ) : ( // SELECT-ONE | CHECKBOX
            <>
              <input // field title
              ref={register({ required: true })}
              name={`fields[${fieldIndex}].title`}
              placeholder="Your Question"
              onChange={(e) => changeField(fieldIndex, undefined, e.target.value)}
              value={value}
            />
              <button onClick={addOption}>Add Option</button>
            <div>
            </div>
            {options.map((option: IOption, index: number) => ( // OPTIONS 
              <Option key={index}
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
          </>
        )}
      </div>
      <button
        onClick={() => {
          console.log(fieldIndex);
          deleteField(fieldIndex);
        }}
      >
        Delete
      </button>
      {/* {errors["isQuiz"] && <span>This field is required</span>} */}
    </div>
  );
}
