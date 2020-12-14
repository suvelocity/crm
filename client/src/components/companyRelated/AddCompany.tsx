import React, { useMemo, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { ICompany } from "../../typescript/interfaces";
import { validNameRegex, validPhoneNumberRegex } from "../../helpers/patterns";
import Swal from "sweetalert2";
import { ErrorBtn, ActionBtn } from "../formRelated";
import GoogleMaps from "../GeoSearch";
interface Props {
  company?: ICompany;
  header?: string;
  update?: boolean;
  handleClose?: Function;
}
const AddCompany = (props:Props) => {
  const { register, handleSubmit, errors, control } = useForm();
  const history = useHistory();

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = async (data: Omit<ICompany, "id">) => {
    try {
      if(props.update && props.company) {
        await network.patch(`/api/v1/company/${props.company.id}`, data);
        props.handleClose&& props.handleClose()
        // history.push(`/company/${props.company.id}`);
      }else{
        await network.post("/api/v1/company", data);
        history.push("/company/all");
      }
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  return (
    <Wrapper>
      <Center>
        <TitleWrapper>
          <H1 color='#a3a365'>{props.header? props.header : 'Add Company'}</H1>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridDiv>
            <div>
              <TextField
                id='name'
                label='Name'
                defaultValue={props.company? props.company.name : ''}
                inputRef={register({
                  required: "Company name is required",
                  minLength: {
                    value: 2,
                    message: "Company needs to have a minimum of 2 letters",
                  },
                })}
                name='name'
              />
              {!empty ? (
                errors.name ? (
                  <ErrorBtn tooltipTitle={errors.name.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              <br />
              <br />
              <GoogleMaps
                id='location'
                name='location'
                defaultValue={props.company? props.company.location : ''}
                inputRef={register({
                  required: "Location is required",
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
                  <ActionBtn />
                )
              ) : null}
            </div>
            <div>
              <TextField
                id='contactName'
                label='Contact Name'
                defaultValue={props.company? props.company.contactName : ''}
                inputRef={register({
                  pattern: {
                    value: validNameRegex,
                    message: "Contact name can have only letters and spaces",
                  },
                })}
                name='contactName'
              />
              {!empty ? (
                errors.contactName ? (
                  <Tooltip title={errors.contactName.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color='error'
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              <br />
              <br />
              <TextField
                id='contactPosition'
                name='contactPosition'
                defaultValue={props.company? props.company.contactPosition : ''}
                inputRef={register()}
                label='Contact Position'
              />
              {!empty ? (
                errors.contactPosition ? (
                  <Tooltip title={errors.contactPosition.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color='error'
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
              <br />
              <br />
              <TextField
                id='contactNumber'
                defaultValue={props.company? props.company.contactNumber : ''}
                label='Contact Phone Number'
                inputRef={register({
                  pattern: {
                    value: validPhoneNumberRegex,
                    message: "Invalid Phone Number",
                  },
                })}
                name='contactNumber'
              />
              {!empty ? (
                errors.contactNumber ? (
                  <Tooltip title={errors.contactNumber.message}>
                    <IconButton style={{ cursor: "default" }}>
                      <ErrorOutlineIcon
                        style={{ width: "30px", height: "30px" }}
                        color='error'
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <ActionBtn />
                )
              ) : null}
            </div>
          </GridDiv>
          <br />

          <TextField
            id='description'
            multiline
            fullWidth
            rows={5}
            variant='outlined'
            defaultValue={props.company? props.company.description : ''}
            name='description'
            inputRef={register({
              maxLength: {
                value: 500,
                message: "Description Details are too long",
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
          <Button
            id='submitButton'
            style={{ backgroundColor: "#a3a365", color: "white" }}
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

export default AddCompany;
