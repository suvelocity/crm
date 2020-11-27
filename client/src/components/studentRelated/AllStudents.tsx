import React, { useState, useEffect } from "react";
import network from "../../helpers/network";
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
} from "../../styles/styledComponents";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from "@material-ui/icons/Person";
import { IStudent, IClass } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import styled from "styled-components";
import { formatPhone } from "../../helpers/general";
import searchResults from "../../functions/searchStudents";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightBold,
      marginLeft: 10,
      marginTop: 3,
    },
  })
);

function AllStudents() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [classNames, setClassNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [classFilter, setClassFilter] = useState<string | undefined>("");
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([]);
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/student/all");
      const names = data.map((student: IStudent) => student.Class?.name);
      setClassNames(names);
      setStudents(data);
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    if (students) {
      setFilteredStudents(students);
    }
  }, [students]);
  const filter = (by: string, value: string) => {
    switch (by) {
      case "class":
        return setFilteredStudents(
          students.filter((student: IStudent) =>
            !value ? true : student.Class.name === value
          )
        );
        break;
    }
  };
  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1>All Students</H1>
        </TitleWrapper>
        <br />
        <div style={{ display: "flex" }}>
          <select
            onChange={(e) => filter("class", e.target.value)}
            defaultValue="none"
          >
            <option value="">none</option>
            {classNames.map((name) => (
              <option value={name}>{name}</option>
            ))}
          </select>
          <input
            onChange={(e) =>
              !e.target.value
                ? setFilteredStudents(students)
                : setFilteredStudents(searchResults(e.target.value, students))
            }
          ></input>
          <StyledLink to="/student/add">
            <Button variant="contained" color="primary">
              Add Student
            </Button>
          </StyledLink>
        </div>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {students && (
            <li>
              <TableHeader>
                <PersonIcon />
                <StyledSpan weight="bold">name</StyledSpan>
                <StyledSpan weight="bold">class</StyledSpan>
                <StyledSpan weight="bold">email</StyledSpan>
                <StyledSpan weight="bold">phone</StyledSpan>
              </TableHeader>
            </li>
          )}
          {filteredStudents &&
            filteredStudents.map((student) => (
              <li>
                <StyledLink color="black" to={`/student/${student?.id}`}>
                  <StyledDiv>
                    <PersonIcon />
                    <StyledSpan weight="bold">
                      {student.firstName}&nbsp;{student.lastName}
                    </StyledSpan>
                    <StyledSpan>{student.Class.name}</StyledSpan>
                    <StyledSpan>{student.email}</StyledSpan>
                    <StyledSpan>{formatPhone(student.phone)}</StyledSpan>
                  </StyledDiv>
                </StyledLink>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
}

export default AllStudents;
