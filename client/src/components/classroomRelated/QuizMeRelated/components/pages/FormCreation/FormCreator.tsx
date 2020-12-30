import React, { useState, useEffect, useContext } from "react";
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
  Input,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";


import network from "../../../../../../helpers/network";
import { AuthContext } from "../../../../../../helpers";

import {
  IFormExtended,
  IField,
  IFieldExtended,
  IOption,
} from "../../../../../../typescript/interfaces";
import Field from "./Field";

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "2em",
    minWidth: '500px'
  },
  form: {
    padding: "1em",
    backgroundColor: "#e2ecff",
    border: "8px solid #6d90d4",
    borderRadius: "10px",
    width: "50vw",
    minWidth: '450px'
  },
  flexCenter: {
    display: "flex",
    justifyContent: "center",
  },
  setting: {
    display: "inline-block",
  },
  label: {
    fontWeight: 600,
    fontSize: "1.25em",
    margin: "0.5em 0",
  },
  horizontalMargin: {
    margin: "0 0.5em",
  },
  verticalMargin: {
    margin: "1em 0",
  },
  addField: {
    marginLeft: '0.25em'
  }
}));

export default function FormCreator() {
  //@ts-ignore
  const { user } = useContext(AuthContext);
  // console.log('user: ', user);

  const classes = useStyles();
  const [fields, setFields] = useState<Omit<IFieldExtended, "id" | "formId">[]>(
    []
  );
  const [isQuiz, setIsQuiz] = useState<boolean>(false);
  const { register, handleSubmit, control, watch, errors } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);
    // const formattedData = {
    //   ...data,
    //   fields: data.fields.map((field: IField) => ({
    //     ...field,
    //     typeId: Number(field.typeId),
    //   })),
    //   isQuiz: Number(data.isQuiz) ? true : false,
    //   creatorId: user.id, // user context!!
    // };
    // console.log(formattedData);
    // const createdForm = await network.post("/api/v1/form/full", formattedData);
  };

  const addField = () => {
    const newFields = fields.slice();
    newFields.push({
      title: "",
      typeId: 2,
    });
    setFields(newFields);
  };
  const changeField = (
    index: number,
    typeId?: number,
    title?: string,
    options?: IOption[]
  ) => {
    const fieldsArr = fields.slice();
    if (typeId) {
      fieldsArr[index].typeId = typeId;
    }
    if (title || title === "") {
      fieldsArr[index].title = title;
    }
    if (options) {
      fieldsArr[index].Options = options;
    }
    setFields(fieldsArr);
  };
  const deleteField = (index: number) => {
    const fieldsArr = fields.slice();
    fieldsArr.splice(index, 1);
    setFields(fieldsArr);
  };

  return (
    <Container className={classes.formWrapper}>
      <button onClick={() => console.log(fields)}> 
        LOG
      </button>
      <form className={classes.form}>
        <Container
        // className={classes.flexCenter}
        >
          <div className={classes.setting}>
            {/* NAME OF THE FORM */}
            <div className={classes.label}>
              <label htmlFor={"name"}>What is the name of your form?</label>
              {/* INPUT */}
                <Input
                  inputRef={register({ required: true })}
                  name={"name"}
                  placeholder={"Your answer"}
                  className={classes.horizontalMargin}
                />
                {errors["name"] && <span>This field is required</span>}
            </div>
            {/* IS QUIZ? */}
            <div>
              <label htmlFor={"isQuiz"} className={classes.label}>
                is it a form or a quiz?
              </label>
              {/* RADIO INPUT*/}
              {/* <div> */}
              {/* <div> */}
              <input
                type="radio"
                ref={register({ required: true })}
                name="isQuiz"
                value={0}
                checked={!isQuiz}
                onChange={() => setIsQuiz(!isQuiz)}
              />
              <label htmlFor="isQuiz">Form</label>
              {/* </div> */}
              {/* <div> */}
              <input
                type="radio"
                ref={register({ required: true })}
                name="isQuiz"
                value={1}
                checked={isQuiz}
                onChange={() => setIsQuiz(!isQuiz)}
              />
              <label htmlFor="isQuiz">Quiz</label>
              {/* </div> */}
              {/* </div> */}
            </div>
          </div>

          {fields.map((field, index) => (
            <Field
              key={index}
              register={register}
              Controller={Controller}
              control={control}
              fieldIndex={index}
              typeId={field.typeId}
              value={field.title}
              changeField={changeField}
              deleteField={deleteField}
              isQuiz={isQuiz}
            />
          ))}
          <div className={classes.verticalMargin}>
            <Button onClick={addField} variant={"contained"} color={"primary"}>
              <Typography component={'span'}>
                Add Field
              </Typography>
              <AddCircleOutlineIcon 
                className={classes.addField}
                color={'inherit'}
                // fontSize={'large'}
              />
            </Button>
          </div>
          <div className={classes.flexCenter}>
            <Button
              variant={"contained"}
              color={"primary"}
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </div>
        </Container>
      </form>
    </Container>
  );
}
