import React, { useMemo, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import network from "../../helpers/network";
import { TextField, Button, Tooltip, InputLabel } from "@material-ui/core";
import {
  Wrapper,
  TitleWrapper,
  H1,
  Center,
  GridDiv,
} from "../../styles/styledComponents";
import { useHistory } from "react-router-dom";
import { IJob, ICompany } from "../../typescript/interfaces";
import { validNameRegex } from "../../helpers/patterns";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import { ErrorBtn, ActionBtn } from "../formRelated";
import Swal from "sweetalert2";
import GoogleMaps from "../GeoSearch";

const AddJob = () => {
  const { register, handleSubmit, errors, control } = useForm();
  const [companies, setCompanies] = useState<Pick<ICompany, "id" | "name">[]>(
    []
  );
  const history = useHistory();

  const empty = Object.keys(errors).length === 0;

  const onSubmit = async (data: Omit<IJob, "id">) => {
    try {
      await network.post("/api/v1/job", data);
      history.push("/job/all");
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/company/all");
      setCompanies(
        data.map((company: ICompany) => ({
          name: company.name,
          id: company.id,
        }))
      );
    })();
  }, []);

  return (
    <Wrapper width='80%'>
      <Center>
        <TitleWrapper>
          <H1 color='#bb4040'>Add Job</H1>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <GridDiv repeatFormula='1fr 0.5fr 3fr'>
            <div>
              <FormControl
                style={{ minWidth: 255 }}
                error={Boolean(errors.companyId)}
              >
                <InputLabel>Please select a company</InputLabel>
                <Controller
                  as={
                    <Select>
                      {companies.map(
                        (company: Pick<ICompany, "id" | "name">) => (
                          <MenuItem key={`opt${company.id}`} value={company.id}>
                            {company.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  }
                  name='companyId'
                  rules={{ required: "Company is required" }}
                  control={control}
                  defaultValue=''
                />
              </FormControl>
              {!empty ? (
                errors.companyId ? (
                  <ErrorBtn tooltipTitle={errors.companyId.message} />
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
                    value: 2,
                    message: "Position needs to have a minimum of 2 letters",
                  },
                })}
                name='position'
              />
              {!empty ? (
                errors.position ? (
                  <ErrorBtn tooltipTitle={errors.position.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(3)}
              <GoogleMaps
                id='location'
                name='location'
                inputRef={register({
                  required: "Location is required",
                })}
                width='100%'
                label='Location'
              />
              {!empty ? (
                errors.location ? (
                  <ErrorBtn tooltipTitle={errors.location.message} />
                ) : (
                  <ActionBtn />
                )
              ) : null}
              {generateBrs(2)}
              <TextField
                name='contact'
                fullWidth
                inputRef={register({ required: "Contact is required" })}
                label='Contact'
              />
              {!empty ? (
                errors.contact ? (
                  <ErrorBtn tooltipTitle={errors.contact.message} />
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
                  <ErrorBtn tooltipTitle={errors.description.message} />
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
                  <ErrorBtn tooltipTitle={errors.requirements.message} />
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
                  <ErrorBtn tooltipTitle={errors.additionalDetails.message} />
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
