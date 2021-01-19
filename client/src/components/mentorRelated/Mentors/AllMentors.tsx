import React, { useCallback, useEffect, useState } from "react";
import network from "../../../helpers/network";
import {
  H1,
  Wrapper,
  TitleWrapper,
  StyledLink,
  Center,
  StyledSpan,
  TableHeader,
  StyledUl,
  StyledDiv,
} from "../../../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import Swal from "sweetalert2";
import Switch from "@material-ui/core/Switch";
import { InputLabel, Select, MenuItem, TextField } from "@material-ui/core";
import {
  IMentor,
  SelectInputs,
  filterMentorObject,
} from "../../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { formatPhone, capitalize } from "../../../helpers/general";

function AllMentors() {
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [allMentors, setAllMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterAttributes, setFilterAttributes] = useState<filterMentorObject>({
    Company: "",
    Gender: "",
    Address: "",
    Available: "",
    Search: "",
  });
  const [filterOptionsArray, setFilterOptionsArray] = useState<SelectInputs[]>(
    []
  );
  const fetchMentors = useCallback(async() => {
    const { data } = await network.get("/api/v1/M/mentor");
    // data.sort((a: IMentor, b: IMentor) => a.available  === b.available ? 0 : a.available ? -1 : 1 );
    setMentors(data);
    setLoading(false);
    setAllMentors(data);
    const companyFilters: string[] = Array.from(
      new Set(data.map((mentor: IMentor) => mentor.company))
    );
    const genderFilters: string[] = Array.from(
      new Set(data.map((mentor: IMentor) => mentor.gender))
    );
    const addressFilters: string[] = Array.from(
      new Set(data.map((mentor: IMentor) => mentor.address))
    );
    const availableFilters: string[] = ["Available", "Not Available"];
    setFilterOptionsArray([
      {
        filterBy: "Company",
        possibleValues: companyFilters,
      },
      {
        filterBy: "Gender",
        possibleValues: genderFilters,
      },
      {
        filterBy: "Address",
        possibleValues: addressFilters,
      },
      {
        filterBy: "Available",
        possibleValues: availableFilters,
      },
    ]);
  },[loading])

  useEffect(() => {
    fetchMentors();
  }, []);

  const filterFunc = (category: string, filterField: string): void => {
    let newAttributes: filterMentorObject = filterAttributes;
    if (category === "Company") {
      newAttributes = { ...newAttributes, Company: filterField };
    }
    if (category === "Gender") {
      newAttributes = { ...newAttributes, Gender: filterField };
    }
    if (category === "Address") {
      newAttributes = { ...newAttributes, Address: filterField };
    }
    if (category === "Available") {
      newAttributes = { ...newAttributes, Available: filterField };
    }
    if (category === "Search") {
      newAttributes = { ...newAttributes, Search: filterField };
    }
    setFilterAttributes(newAttributes);
  };

  useEffect(() => {
    let newFilteredMentors = allMentors;
    if (filterAttributes.Address !== "") {
      newFilteredMentors = newFilteredMentors.filter(
        (mentor) => mentor.address === filterAttributes.Address
      );
    }
    if (filterAttributes.Company !== "") {
      newFilteredMentors = newFilteredMentors.filter(
        (mentor) => mentor.company === filterAttributes.Company
      );
    }
    if (filterAttributes.Gender !== "") {
      newFilteredMentors = newFilteredMentors.filter(
        (mentor) => mentor.gender === filterAttributes.Gender
      );
    }
    if (filterAttributes.Available !== "") {
      newFilteredMentors = newFilteredMentors.filter((mentor) =>
        filterAttributes.Available === "Available"
          ? mentor.available === true
          : mentor.available === false
      );
    }
    if (filterAttributes.Search !== "") {
      newFilteredMentors = newFilteredMentors.filter(
        (mentor) =>
          mentor.name
            .toLocaleLowerCase()
            .includes(filterAttributes.Search.toLocaleLowerCase()) ||
          mentor.company
            .toLocaleLowerCase()
            .includes(filterAttributes.Search.toLocaleLowerCase()) ||
          mentor.email
            .toLocaleLowerCase()
            .includes(filterAttributes.Search.toLocaleLowerCase()) ||
          mentor.address
            .toLocaleLowerCase()
            .includes(filterAttributes.Search.toLocaleLowerCase()) ||
          mentor.role
            .toLocaleLowerCase()
            .includes(filterAttributes.Search.toLocaleLowerCase()) ||
          mentor.gender
            .toLocaleLowerCase()
            .includes(filterAttributes.Search.toLocaleLowerCase())
      );
    }
    setMentors(newFilteredMentors);
  }, [filterAttributes, allMentors]);

  const changeAvailabilityOfMentor = async (
    id: number | undefined,
    currentAvailability: boolean
  ): Promise<void> => {
    if (id) {
      await network.put(`/api/v1/M/mentor/${id}`, {
        available: !currentAvailability,
      });
      const { data } = await network.get("/api/v1/M/mentor");
      setMentors(data);
      setAllMentors(data);
    }
  };
  async function uploadFile(files:any) {
    let formData = new FormData();       
    if(!files || !files[0]) return console.log('files', files);    
    try{
      const reader = new FileReader();
      reader.onload = async function(e) {
          try{
            const body = {csvString: reader.result}
            const {data} = await network.post('/api/v1/fileupload/?model=student', body);
            await Swal.fire("Success", data.message, "success");
            setLoading(true);
            fetchMentors();
          }catch(e){
            console.log(e)
            await Swal.fire("Error", e.message ,"error");
          }
      }
      reader.readAsText(files[0]);
    }catch(e){
      console.log(e.message);
    }

    // await fetch('/upload.php', {
    //   method: "POST", 
    //   body: formData
    // });    
    // alert('The file has been uploaded successfully.');
  }

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1 color="#c47dfa">All Mentors</H1>
        </TitleWrapper>
        <br />
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          {filterOptionsArray.map((arr) => (
            <div style={{width:`${100 / filterOptionsArray.length}`}}>
              <InputLabel>{arr.filterBy}</InputLabel>
              <Select
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  filterFunc(arr.filterBy, e.target.value as string);
                }}
              >
                <MenuItem value={""}>All</MenuItem>
                {arr.possibleValues.map((field) => (
                  <MenuItem value={field}>{field}</MenuItem>
                ))}
              </Select>
            </div>
          ))}
          <div>
            <TextField
              label="Search"
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                filterFunc("Search", e.target.value as string);
              }}
            />
          </div>
        </div>
        <div>
        <input id="fileupload" onChange={(e) => uploadFile(e.target.files)} accept={'.csv,.xlsx,xls'} type="file" name="fileupload" />
        {/* <button id="upload-button" onClick={uploadFile}> Upload </button> */}
        </div>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {mentors && (
            <li>
              <TableHeader repeatFormula="0.2fr 1fr 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr">
                <PersonIcon />
                <StyledSpan weight="bold">Name</StyledSpan>
                <StyledSpan weight="bold">Company</StyledSpan>
                <StyledSpan weight="bold">Email</StyledSpan>
                {/* <StyledSpan weight='bold'>Phone</StyledSpan> */}
                <StyledSpan weight="bold">Address</StyledSpan>
                <StyledSpan weight="bold">Role</StyledSpan>
                <StyledSpan weight="bold">Experience</StyledSpan>
                <StyledSpan weight="bold">Gender</StyledSpan>
                <StyledSpan weight="bold">Available</StyledSpan>
              </TableHeader>
            </li>
          )}
          {mentors && (
            <div style={{ overflow: "scroll", maxHeight: 500 }}>
              {mentors.map((mentor) => (
                <li>
                  <StyledDiv repeatFormula="0.2fr 1fr 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr">
                    <PersonIcon />
                    <StyledLink color="black" to={`/mentor/${mentor?.id}`}>
                      <StyledSpan weight="bold">
                        {capitalize(mentor.name)}
                      </StyledSpan>
                    </StyledLink>
                    <StyledSpan>{capitalize(mentor.company)}</StyledSpan>
                    <StyledSpan>{mentor.email}</StyledSpan>
                    {/* <StyledSpan>{formatPhone(mentor.phone)}</StyledSpan> */}
                    <StyledSpan>{mentor.address}</StyledSpan>
                    <StyledSpan>{mentor.role}</StyledSpan>
                    <StyledSpan>{mentor.experience}</StyledSpan>
                    <StyledSpan>{mentor.gender}</StyledSpan>
                    <StyledSpan>
                      <Switch
                        checked={mentor.available}
                        onChange={() =>
                          changeAvailabilityOfMentor(
                            mentor?.id,
                            mentor.available
                          )
                        }
                        color="primary"
                        name="checkedB"
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </StyledSpan>
                  </StyledDiv>
                </li>
              ))}
            </div>
          )}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
}

export default AllMentors;
