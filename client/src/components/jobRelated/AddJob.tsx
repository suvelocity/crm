import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import network from "../../helpers/network";
import { validEmailRegex, validPhoneNumberRegex } from "../../helpers/patterns";
import CloseIcon from "@material-ui/icons/Close";
import WarningIcon from "@material-ui/icons/Warning";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from '@material-ui/icons/Add';
import IconButton from "@material-ui/core/IconButton";
import {Wrapper, TitleWrapper, H1} from '../../styles/styledComponents';
import {IJob} from '../../typescript/interfaces';
import { TextareaAutosize } from "@material-ui/core";

const AddJob = () => {
    const { register, handleSubmit, errors } = useForm();

    const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);
  
    const onSubmit = (data: IJob) => {
      console.log(data);
      //await network.post('/jobs', data);
    };
  
    return (
      <Wrapper>
        <TitleWrapper>
          <Tooltip title="hell">
            <H1 color='red'>Add Job</H1>
          </Tooltip>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Company"
            name="company"
            inputRef={register({
              required: "Company is required",
            })}
          />
          {!empty ? (
            errors.company ? (
              <Tooltip title={errors.company.message}>
                <IconButton style={{ cursor: "default" }}>
                  <ErrorOutlineIcon
                    style={{ width: "30px", height: "30px" }}
                    color="error"
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton style={{ cursor: "default" }}>
                <DoneIcon color="action" />
              </IconButton>
            )
          ) : null}
          <br />
          <TextField
            label="Position"
            inputRef={register({ required: "Position title is required" })}
            name="position"
          />
          {!empty ? (
            errors.position ? (
              <Tooltip title={errors.position.message}>
                <IconButton style={{ cursor: "default" }}>
                  <ErrorOutlineIcon
                    style={{ width: "30px", height: "30px" }}
                    color="error"
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton style={{ cursor: "default" }}>
                <DoneIcon color="action" />
              </IconButton>
            )
          ) : null}
          <br />
          <TextField
            name="contact"
            inputRef={register({ required: "Contact is required" })}
            label="Contact"
          />
          {!empty ? (
            errors.contact ? (
              <Tooltip title={errors.contact.message}>
                <IconButton style={{ cursor: "default" }}>
                  <ErrorOutlineIcon
                    style={{ width: "30px", height: "30px" }}
                    color="error"
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton style={{ cursor: "default" }}>
                <DoneIcon color="action" />
              </IconButton>
            )
          ) : null}
          <br />
          <TextField
            name="location"
            inputRef={register({
              required: "Location is required",
            })}
            label="Location"
          />
          {!empty ? (
            errors.location ? (
              <Tooltip title={errors.location.message}>
                <IconButton style={{ cursor: "default" }}>
                  <ErrorOutlineIcon
                    style={{ width: "30px", height: "30px" }}
                    color="error"
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton style={{ cursor: "default" }}>
                <DoneIcon color="action" />
              </IconButton>
            )
          ) : null}
          <br />
          <br />
          <TextField
            multiline
            rows={4}
            variant="outlined"
            name="description"
            inputRef={register({ required: "Description is required" })}
            label="Description"
          />
          {!empty ? (
            errors.description ? (
              <Tooltip title={errors.description.message}>
                <IconButton style={{ cursor: "default" }}>
                  <ErrorOutlineIcon
                    style={{ width: "30px", height: "30px" }}
                    color="error"
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton style={{ cursor: "default" }}>
                <DoneIcon color="action" />
              </IconButton>
            )
          ) : null}
          <br />
          <br />
          <TextField
            multiline
            rows={4}
            variant="outlined"
            name="requirements"
            inputRef={register({
              required: "Requirements are required",
            })}
            label="Job Requirements"
          />
          {!empty ? (
            errors.requirements ? (
              <Tooltip title={errors.requirements.message}>
                <IconButton style={{ cursor: "default" }}>
                  <ErrorOutlineIcon
                    style={{ width: "30px", height: "30px" }}
                    color="error"
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton style={{ cursor: "default" }}>
                <DoneIcon color="action" />
              </IconButton>
            )
          ) : null}
          <br />
          <br />
            <Button style={{backgroundColor:'#bb4040' , color:'white'}}  variant="contained" color='primary' type="submit">
            Submit
          </Button>
        </form>
      </Wrapper>
    );
  }

export default AddJob;