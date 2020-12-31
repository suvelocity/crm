import React, { useMemo, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import network from "../../../helpers/network";
import {
  validEmailRegex,
  validNameRegex,
  validPhoneNumberRegex,
  validCompanyRegex,
} from "../../../helpers/patterns";
import DoneIcon from "@material-ui/icons/Done";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {
  GridDiv,
  Wrapper,
  TitleWrapper,
  H1,
  Center,
} from "../../../styles/styledComponents";
import { IMentor } from "../../../typescript/interfaces";
import { useHistory } from "react-router-dom";
import GoogleMaps from "../../GeoSearch";
import Swal from "sweetalert2";

interface Props {
  mentor?: IMentor;
  header?: string;
  update?: boolean;
  handleClose?: Function;
}
const AddMentor: React.FC<Props> = ({
  mentor,
  header,
  update,
  handleClose,
}) => {
  const { register, handleSubmit, errors, control } = useForm();
  const history = useHistory();

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onSubmit = async (data: IMentor) => {
    try {
      if (update && mentor) {
        await network.put(`/api/v1/M/mentor/${mentor.id}`, data);
        handleClose && handleClose();
      } else {
        data.available = true;
        await network.post("/api/v1/M/mentor/", data);
        Swal.fire("Success!", "", "success");
        history.push("/mentor/all");
      }
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  return (
    <Wrapper>
      <Center>
        <TitleWrapper>
          <H1 color={"#c47dfa"}>{update ? "Edit Mentor" : "Add Mentor"}</H1>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridDiv>
            <div>
              <TextField
                id="name"
                name="name"
                defaultValue={mentor ? mentor.name : ""}
                inputRef={register({
                  required: "Full Name is required",
                  pattern: {
                    value: validNameRegex,
                    message: "Full Name can have only letters and spaces",
                  },
                  minLength: {
                    value: 2,
                    message: "Full Name needs to be a minimum of 2 letters",
                  },
                })}
                label="Full Name"
              />
              {!empty ? (
                errors.name ? (
                  <Tooltip title={errors.name.message}>
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
                id="company"
                name="company"
                defaultValue={mentor ? mentor.company : ""}
                inputRef={register({
                  required: "Company is required",
                  minLength: {
                    value: 2,
                    message: "Company needs to be a minimum of 2 letters",
                  },
                  pattern: {
                    value: validCompanyRegex,
                    message: "Company can have only letters numbers and spase",
                  },
                })}
                label="Company"
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
                id="email"
                label="Email"
                name="email"
                defaultValue={mentor ? mentor.email : ""}
                inputRef={register({
                  required: "Email is required",
                  pattern: {
                    value: validEmailRegex,
                    message: "Please Enter a Valid Email",
                  },
                })}
              />
              {!empty ? (
                errors.email ? (
                  <Tooltip title={errors.email.message}>
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
                id="phone"
                name="phone"
                defaultValue={mentor ? mentor.phone : ""}
                inputRef={register({
                  required: "Phone is required",
                  pattern: {
                    value: validPhoneNumberRegex,
                    message: "invalid phone number",
                  },
                })}
                label="Phone Number"
              />
              {!empty ? (
                errors.phone ? (
                  <Tooltip title={errors.phone.message}>
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
            </div>
            <div>
              <TextField
                id="role"
                name="role"
                defaultValue={mentor ? mentor.role : ""}
                inputRef={register({
                  required: "role is required",
                })}
                label="Role"
              />
              {!empty ? (
                errors.role ? (
                  <Tooltip title={errors.role.message}>
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
                id="experience"
                name="experience"
                defaultValue={mentor ? mentor.experience : 0}
                type="number"
                inputRef={register({
                  required: "experience is required",
                  valueAsNumber: true,
                })}
                label="Experience"
              />
              {!empty ? (
                errors.experience ? (
                  <Tooltip title={errors.experience.message}>
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
              <GoogleMaps
                id="address"
                name="address"
                defaultValue={mentor ? mentor.address : ""}
                inputRef={register({ required: "Address is required" })}
                label="Address"
              />
              {!empty ? (
                errors.address ? (
                  <Tooltip title={errors.address.message}>
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
              <FormControl
                style={{ minWidth: 200 }}
                error={Boolean(errors.classId)}
              >
                <InputLabel>Gender</InputLabel>
                <Controller
                  as={
                    <Select>
                      <MenuItem key={"Male"} value={"male"}>
                        {"Male"}
                      </MenuItem>
                      <MenuItem key={"Female"} value={"female"}>
                        {"Female"}
                      </MenuItem>
                    </Select>
                  }
                  name="gender"
                  defaultValue={mentor ? mentor.gender : "Female"}
                  control={control}
                />
              </FormControl>
              {!empty ? (
                errors.classId ? (
                  <Tooltip title={errors.classId.message}>
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
            </div>
          </GridDiv>
          <br />
          <Button
            id="submitButton"
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Center>
    </Wrapper>
  );
};

export default AddMentor;
