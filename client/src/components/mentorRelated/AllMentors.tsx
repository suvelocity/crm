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
import { IMentor } from '../../typescript/interfaces';
import { Loading } from 'react-loading-wrapper';
import 'react-loading-wrapper/dist/index.css';
import { formatPhone, capitalize } from '../../helpers/general';

function AllMentors() {
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { data } = await network.get('/api/v1/M/mentor');
      setMentors(data);
      setLoading(false);
    })();
  }, []);

  const changeAvailabilityOfMentor = async (
    id: number | undefined,
    currentAvailability: boolean
  ): Promise<void> => {
    if (id) {
      await network.put(`/api/v1/M/mentor/${id}`, {
        available: !currentAvailability,
      });
    }
  };

  return (
    <Wrapper width='80%'>
      <Center>
        <TitleWrapper>
          <H1 color='#c47dfa'>All Mentors</H1>
        </TitleWrapper>
        <br />
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
                <StyledLink color='black' to={`/mentor/${mentor?.id}`}>
                  <StyledDiv repeatFormula='0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'>
                    <PersonIcon />
                    <StyledSpan weight='bold'>
                      {capitalize(mentor.name)}
                    </StyledSpan>
                    <StyledSpan>{capitalize(mentor.company)}</StyledSpan>
                    <StyledSpan>{mentor.email}</StyledSpan>
                    <StyledSpan>{formatPhone(mentor.phone)}</StyledSpan>
                    <StyledSpan>{mentor.address}</StyledSpan>
                    <StyledSpan>{mentor.job}</StyledSpan>
                    <StyledSpan>
                      <Switch
                        checked={mentor.available}
                        onChange={() =>
                          changeAvailabilityOfMentor(
                            mentor?.id,
                            mentor.available
                          )
                        }
                        color='primary'
                        name='checkedB'
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    </StyledSpan>
                    <StyledSpan>{mentor.gender}</StyledSpan>
                  </StyledDiv>
                </StyledLink>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
}

export default AllMentors;
