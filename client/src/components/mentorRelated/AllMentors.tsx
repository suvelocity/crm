import React, { useEffect, useState } from 'react';
import network from '../../helpers/network';
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
} from '../../styles/styledComponents';
import PersonIcon from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import { InputLabel, Select, MenuItem } from '@material-ui/core';
import {
  IMentor,
  SelectInputs,
  filterMentorObject,
} from '../../typescript/interfaces';
import { Loading } from 'react-loading-wrapper';
import 'react-loading-wrapper/dist/index.css';
import { formatPhone, capitalize } from '../../helpers/general';

function AllMentors() {
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [allMentors, setAllMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterAttributes, setFilterAttributes] = useState<filterMentorObject>({
    Company: '',
    Gender: '',
    Address: '',
  });
  const [filterOptionsArray, setFilterOptionsArray] = useState<SelectInputs[]>(
    []
  );

  useEffect(() => {
    (async () => {
      const { data } = await network.get('/api/v1/M/mentor');
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
      setFilterOptionsArray([
        {
          filterBy: 'Company',
          possibleValues: companyFilters,
        },
        {
          filterBy: 'Gender',
          possibleValues: genderFilters,
        },
        {
          filterBy: 'Address',
          possibleValues: addressFilters,
        },
      ]);
    })();
  }, []);

  const filterFunc = (category: string, filterField: string): void => {
    let newAttributes: filterMentorObject = filterAttributes;
    if (category === 'Company') {
      newAttributes = {...newAttributes, Company: filterField}
    }
    if (category === 'Gender') {
      newAttributes = {...newAttributes, Gender: filterField}
    }
    if (category === 'Address') {
      newAttributes = {...newAttributes, Address: filterField}
    }
    setFilterAttributes(newAttributes)
    console.log(newAttributes)
  };

  useEffect(() => {
    let newFilteredMentors = allMentors;
    if (filterAttributes.Address !== '') {
      newFilteredMentors = newFilteredMentors.filter((mentor)=>mentor.address === filterAttributes.Address)
    }
    if (filterAttributes.Company !== '') {
      newFilteredMentors = newFilteredMentors.filter((mentor)=>mentor.company === filterAttributes.Company)
    }
    if (filterAttributes.Gender !== '') {
      newFilteredMentors = newFilteredMentors.filter((mentor)=>mentor.gender === filterAttributes.Gender)
    }
    setMentors(newFilteredMentors);
  }, [filterAttributes, allMentors])

  const changeAvailabilityOfMentor = async (
    id: number | undefined,
    currentAvailability: boolean
  ): Promise<void> => {
    if (id) {
      await network.put(`/api/v1/M/mentor/${id}`, {
        available: !currentAvailability,
      });
      const { data } = await network.get('/api/v1/M/mentor');
      setMentors(data);
    }
  };

  return (
    <Wrapper width='80%'>
      <Center>
        <TitleWrapper>
          <H1 color='#c47dfa'>All Mentors</H1>
        </TitleWrapper>
        <br />
        <div style={{ display: 'flex' }}>
          {filterOptionsArray.map((arr) => (
            <div>
              <InputLabel>{arr.filterBy}</InputLabel>
              <Select
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  filterFunc(arr.filterBy, e.target.value as string);
                }}
              >
                <MenuItem value={''}>All</MenuItem>
                {arr.possibleValues.map((field) => (
                  <MenuItem value={field}>{field}</MenuItem>
                ))}
              </Select>
            </div>
          ))}
          <StyledLink to='/mentor/add'>
            <Button
              variant='contained'
              style={{
                backgroundColor: '#c47dfa',
                color: 'white',
                marginLeft: 10,
              }}
            >
              new mentor
            </Button>
          </StyledLink>
        </div>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {mentors && (
            <li>
              <TableHeader repeatFormula='0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'>
                <PersonIcon />
                <StyledSpan weight='bold'>Name</StyledSpan>
                <StyledSpan weight='bold'>Company</StyledSpan>
                <StyledSpan weight='bold'>Email</StyledSpan>
                <StyledSpan weight='bold'>Phone</StyledSpan>
                <StyledSpan weight='bold'>Address</StyledSpan>
                <StyledSpan weight='bold'>Job</StyledSpan>
                <StyledSpan weight='bold'>Available</StyledSpan>
                <StyledSpan weight='bold'>Gender</StyledSpan>
              </TableHeader>
            </li>
          )}
          {mentors &&
            mentors.map((mentor) => (
              <li>
                <StyledDiv repeatFormula='0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'>
                  <PersonIcon />
                  <StyledLink color='black' to={`/mentor/${mentor?.id}`}>
                    <StyledSpan weight='bold'>
                      {capitalize(mentor.name)}
                    </StyledSpan>
                  </StyledLink>
                  <StyledSpan>{capitalize(mentor.company)}</StyledSpan>
                  <StyledSpan>{mentor.email}</StyledSpan>
                  <StyledSpan>{formatPhone(mentor.phone)}</StyledSpan>
                  <StyledSpan>{mentor.address}</StyledSpan>
                  <StyledSpan>{mentor.job}</StyledSpan>
                  <StyledSpan>
                    <Switch
                      checked={mentor.available}
                      onChange={() =>
                        changeAvailabilityOfMentor(mentor?.id, mentor.available)
                      }
                      color='primary'
                      name='checkedB'
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                  </StyledSpan>
                  <StyledSpan>{mentor.gender}</StyledSpan>
                </StyledDiv>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
}

export default AllMentors;
