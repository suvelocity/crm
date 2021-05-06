import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import network from "../../../helpers/network";
import {
  validEmailRegex,
  validNameRegex,
  validPhoneNumberRegex,
  validCompanyRegex,
} from "../../../helpers/patterns";
import { ActionBtn, ErrorBtn } from "../../formRelated";
import { onlyNumbersRegex} from "../../../helpers";
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
import { IMentor, IClass } from "../../../typescript/interfaces";
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
  const [availableClasses, setAvailbleClasses] = useState<IClass[]>([])
  const history = useHistory();

  const empty = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const getAvailableClasses = useCallback(async () => {
    const {data} : {data : IClass[]} = await network.get('/api/v1/class/all-active-classes');
    setAvailbleClasses(data)
  },[])
  useEffect(() =>{
    getAvailableClasses();
  } ,[])
  const errorComponent = (name:string) => {
    if(empty) return null
    return errors[name] ?
    <ErrorBtn tooltipTitle={errors[name].message} />
    :<ActionBtn />
  }
  const onSubmit = async (data: IMentor) => {
    if(data.agreedTo){
      //@ts-ignore
      data.agreedTo = data.agreedTo.join(', ');
    }
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
  const religions = ['חילוני/ת','חרדי/ת','דתי/ה','ערבי/ה','אחר']
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
            {errorComponent('name')}
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
            {errorComponent('company')}
              <br />
              <FormControl
                style={{ minWidth: 200 }}
                error={Boolean(errors.classId)}
              >
                <InputLabel>Religion Level</InputLabel>
                <Controller
                  as={
                    <Select>
                      {
                        religions.map((religion:string) =>{
                        return <MenuItem key={religion} value={religion}>
                        {religion}
                        </MenuItem>
                      })
                      }
                    </Select>
                  }
                  name="religionLevel"
                  defaultValue={mentor ? mentor.religionLevel : "אחר"}
                  control={control}
                />
              </FormControl>
              {!empty && <ActionBtn />}
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
            {errorComponent('email')}
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
            {errorComponent('phone')}
            {availableClasses.length > 0 &&
              <>
                <br />
                <FormControl
                  style={{ minWidth: 200, maxWidth: 200,
                  textOverflow: "ellipsis",
                  overflow: "break",
                  wordWrap: "break-word",
                  whiteSpace: "pre"}}
                  error={Boolean(errors.classId)}
                >
                  <InputLabel>Agrees To Participate In</InputLabel>
                  <Controller
                    as={
                      <Select multiple style={{
                        }}>
                        {
                          availableClasses.map((cls:IClass) =>{
                          return <MenuItem key={cls.id!} value={String(cls.id!)}>
                          {cls.name}
                          </MenuItem>
                        })
                        }
                      </Select>
                    }
                    name="agreedTo"
                    defaultValue={ mentor ? mentor.agreedTo ? mentor.agreedTo.split(', ').filter((id: string) => availableClasses.some((cls:IClass) => cls.id == Number(id))): [] :[]} //
                    control={control}
                  />
                </FormControl>
                {!empty && <ActionBtn />}
              </>
            }
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
            {errorComponent('role')}
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
            {errorComponent('experience')}
              <br />
              <FormControl
                style={{ minWidth: 200 }}
                error={Boolean(errors.classId)}
              >
              <GoogleMaps
                id="address"
                name="address"
                defaultValue={mentor ? mentor.address : ""}
                inputRef={register({ required: "Address is required" })}
                label="Address"
              />
              </ FormControl>
            {errorComponent('address')}
              <TextField
                id="age"
                name="age"
                type="number"
                defaultValue={mentor ? mentor.age : 0}
                inputRef={register({
                  valueAsNumber: true,
                  pattern: {
                    value: onlyNumbersRegex,
                    message: "Age needs to be a number",
                  },
                })}
                label="Age"
              />
            {errorComponent('education')}
              <br />
              <FormControl
                style={{ minWidth: 200 }}
                error={Boolean(errors.classId)}
              >
                <InputLabel>Gender</InputLabel>
                <Controller
                  as={
                    <Select>
                      <MenuItem key={"גבר"} value={"גבר"}>
                        {"גבר"}
                      </MenuItem>
                      <MenuItem key={"אישה"} value={"אישה"}>
                        {"אישה"}
                      </MenuItem>
                    </Select>
                  }
                  name="gender"
                  defaultValue={mentor ? mentor.gender : "Female"}
                  control={control}
                />
              </FormControl>
              {errorComponent('gender')}
              <br />
            </div>
          </GridDiv>
          <br />
          <TextField
            id="education"
            multiline
            fullWidth
            defaultValue={mentor ? mentor.education : ""}
            rows={4}
            variant="outlined"
            name="education"
            inputRef={register({
              maxLength: {
                value: 500,
                message: "Education is too long",
              },
            })}
            label="Education"
          />
          {errorComponent('education')}
          <br />
          <br />
          <TextField
            id="preference"
            multiline
            fullWidth
            defaultValue={mentor ? mentor.preference : ""}
            rows={4}
            variant="outlined"
            name="preference"
            inputRef={register({
              maxLength: {
                value: 100,
                message: "Preference is too long",
              },
            })}
            label="Preference"
          />
          {errorComponent('preference')}
          <br />
          <br />
          <TextField
            id="mentoringExperience"
            multiline
            fullWidth
            defaultValue={mentor ? mentor.mentoringExperience : ""}
            rows={4}
            variant="outlined"
            name="mentoringExperience"
            inputRef={register({
              maxLength: {
                value: 100,
                message: "Mentoring Experience is too long",
              },
            })}
            label="Mentoring Experience"
          />
          {errorComponent('mentoringExperience')}
          <br />
          <br />
          <TextField
            id="additional"
            multiline
            fullWidth
            defaultValue={mentor ? mentor.additional : ""}
            rows={4}
            variant="outlined"
            name="additional"
            inputRef={register({
              maxLength: {
                value: 500,
                message: "Additional Information is too long",
              },
            })}
            label="Additional Information"
          />
          {errorComponent('additional')}
          <br />
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
