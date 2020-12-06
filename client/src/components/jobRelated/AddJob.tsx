import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import network from "../../helpers/network";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import {
  Wrapper,
  TitleWrapper,
  H1,
  Center,
  GridDiv,
} from "../../styles/styledComponents";
import { useHistory } from "react-router-dom";
import { IJob } from "../../typescript/interfaces";
import { validNameRegex, validAdressRegex } from "../../helpers/patterns";

const AddJob = () => {
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

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
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color='error'
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color='action' />
                  </IconButton>
                )
              ) : null}
              <br />
              <br />
              <br />
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
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color='error'
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color='action' />
                  </IconButton>
                )
              ) : null}
              <br />
              <br />
              <br />
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
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color='error'
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color='action' />
                  </IconButton>
                )
              ) : null}
              <br />
              <br />
              <br />
              <TextField
                name='contact'
                fullWidth
                inputRef={register({ required: "Contact is required" })}
                label='Contact'
              />
              {!empty ? (
                errors.contact ? (
                  <Tooltip title={errors.contact.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color='error'
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color='action' />
                  </IconButton>
                )
              ) : null}
              <br />
              <br />
              <br />
              <br />
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
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color='error'
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color='action' />
                  </IconButton>
                )
              ) : null}
              <br />
              <br />
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
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color='error'
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color='action' />
                  </IconButton>
                )
              ) : null}
              <br />
              <br />
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
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color='error'
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <IconButton style={{ cursor: "default" }}>
                    <DoneIcon color='action' />
                  </IconButton>
                )
              ) : null}
              <br />
              <br />
              <br />
              <br />
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
