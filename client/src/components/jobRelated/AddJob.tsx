import React from "react";
import { useForm } from "react-hook-form";
import network from "../../helpers/network";
import { TextField, Button, Tooltip } from "@material-ui/core";
import {
  Wrapper,
  TitleWrapper,
  H1,
  Center,
  GridDiv,
} from "../../styles/styledComponents";
import { useHistory } from "react-router-dom";
import { IJob } from "../../typescript/interfaces";
import { validNameRegex } from "../../helpers";
import { ActionBtn, ErrorBtn } from "../formRelated";

const AddJob = () => {
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();

  const empty = Object.keys(errors).length === 0;

  const onSubmit = async (data: Omit<IJob, "id">) => {
    try {
      await network.post("/api/v1/job", data);
      history.push("/job/all");
    } catch (e) {
      alert("error occurred");
    }
  };

  return (
    <Wrapper width='80%'>
      <Center>
        <TitleWrapper>
          <H1 color='#bb4040'>Add Job</H1>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridDiv repeatFormula='1fr 0.5fr 3fr'>
            <div>
              <TextField
                id='company'
                label='Company'
                name='company'
                fullWidth
                inputRef={register({
                  required: "Company is required",
                  pattern: {
                    value: validNameRegex,
                    message: "Company name can have only letters and spaces",
                  },
                  minLength: {
                    value: 3,
                    message: "First name needs to have a minimum of 3 letters",
                  },
                })}
              />
              {!empty ? (
                errors.company ? (
                  <Tooltip title={errors.company.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(3)}
              <TextField
                id='position'
                label='Position'
                fullWidth
                inputRef={register({
                  required: "Position title is required",
                  pattern: {
                    value: validNameRegex,
                    message: "Position can have only letters and spaces",
                  },
                  minLength: {
                    value: 6,
                    message: "Position needs to have a minimum of 3 letters",
                  },
                })}
                name='position'
              />
              {!empty ? (
                errors.position ? (
                  <Tooltip title={errors.position.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(3)}
              <TextField
                id='location'
                name='location'
                fullWidth
                inputRef={register({
                  required: "Location is required",
                  pattern: {
                    value: validNameRegex,
                    message:
                      "Company location can contain only letters and spaces",
                  },
                  minLength: {
                    value: 3,
                    message: "First name needs to have a minimum of 4 letters",
                  },
                })}
                label='Location'
              />
              {!empty ? (
                errors.location ? (
                  <Tooltip title={errors.location.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(3)}

              <TextField
                name='contact'
                fullWidth
                inputRef={register({ required: "Contact is required" })}
                label='Contact'
              />
              {!empty ? (
                errors.contact ? (
                  <Tooltip title={errors.contact.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(4)}
            </div>
            <div></div> {/*placeholder*/}
            <div>
              <br />
              <TextField
                multiline
                fullWidth
                rows={3}
                variant='outlined'
                name='description'
                inputRef={register({
                  required: "Description is required",
                  maxLength: {
                    value: 500,
                    message: "Description are too long",
                  },
                })}
                label='Description'
              />
              {!empty ? (
                errors.description ? (
                  <Tooltip title={errors.description.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}
              <TextField
                id='requirements'
                multiline
                fullWidth
                rows={5}
                variant='outlined'
                name='requirements'
                inputRef={register({
                  required: "Requirements are required",
                  maxLength: {
                    value: 500,
                    message: "Requirements are too long",
                  },
                })}
                label='Job Requirements'
              />
              {!empty ? (
                errors.requirements ? (
                  <Tooltip title={errors.requirements.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}

              <TextField
                id='additionalDetails'
                multiline
                fullWidth
                rows={3}
                variant='outlined'
                name='additionalDetails'
                inputRef={register({
                  maxLength: {
                    value: 500,
                    message: "Additional Details are too long",
                  },
                })}
                label='Additional Details'
              />
              {!empty ? (
                errors.additionalDetails ? (
                  <Tooltip title={errors.additionalDetails.message}>
                    <ErrorBtn />
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(4)}
            </div>
          </GridDiv>

          <Button
            id='submitButton'
            style={{ backgroundColor: "#bb4040", color: "white" }}
            variant='contained'
            color='primary'
            type='submit'
          >
            Submit
          </Button>
        </form>
      </Center>
    </Wrapper>
  );
};

export default AddJob;

const generateBrs = (num: number): JSX.Element[] => {
  const arrOfSpaces = [];
  for (let i = 0; i < num; i++) {
    arrOfSpaces.push(<br />);
  }
  return arrOfSpaces;
};
