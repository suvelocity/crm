import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Button,
} from "@material-ui/core";

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
  submit: {
    display: "flex",
    justifyContent: "center",
  },
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
  const { register, handleSubmit, watch, errors } = useForm();

  const onSubmit = async (data: any) => {
    const formattedData = {
      ...data,
      fields: data.fields.map((field: IField) => ({
        ...field,
        typeId: Number(field.typeId),
      })),
      isQuiz: Number(data.isQuiz) ? true : false,
      creatorId: user.id, // user context!!
    };
    console.log(formattedData);
    const createdForm = await network.post("/api/v1/form/full", formattedData);
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
    if (title !== undefined) {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* NAME OF THE FORM */}
      <div>
        <label htmlFor={"name"}>What is the name of your form?</label>
      </div>
      {/* INPUT */}
      <div>
        <input
          ref={register({ required: true })}
          name={"name"}
          placeholder="Your answer"
        />
        {errors["name"] && <span>This field is required</span>}
      </div>
      {/* IS QUIZ? */}
      <div>
        <label htmlFor={"isQuiz"}>is it a form or a quiz?</label>
      </div>
      {/* RADIO INPUT*/}
      <div>
        <div>
          <input
            type="radio"
            ref={register({ required: true })}
            name="isQuiz"
            value={0}
            checked={!isQuiz}
            onChange={() => setIsQuiz(!isQuiz)}
          />
          <label htmlFor="isQuiz">Form</label>
        </div>
        <div>
          <input
            type="radio"
            ref={register({ required: true })}
            name="isQuiz"
            value={1}
            checked={isQuiz}
            onChange={() => setIsQuiz(!isQuiz)}
          />
          <label htmlFor="isQuiz">Quiz</label>
        </div>
      </div>
      <Button onClick={addField} variant={"contained"} color={"primary"}>
        Add Field
      </Button>

      {fields.map((field, index) => (
        <Field
          key={index}
          register={register}
          fieldIndex={index}
          typeId={field.typeId}
          value={field.title}
          changeField={changeField}
          deleteField={deleteField}
          isQuiz={isQuiz}
        />
      ))}
      <div className={classes.submit}>
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
}
