import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import { IClass, IStudent } from "../../../typescript/interfaces";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";
import styled from "styled-components";

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
      width: "100%",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    flexDirection: "column",
  },
}))(MuiAccordionDetails);

const StudentRow = styled.div`
  margin: 1% 0;
`;

interface classList {
  classId: number;
  name: string;
  students: IStudent[];
}

export default function ClassAccordion({
  classes,
  updatePicks,
}: {
  classes: classList[];
  updatePicks: (value: any, fieldToChange: string) => void;
}) {
  const [expanded, setExpanded] = React.useState<string | false>("panel1");
  const [pickStates, setPickStates] = React.useState<
    Array<Array<number | undefined>>
  >(classes.map((cls: classList) => cls.students.map((_) => undefined)));

  const handlePick: (
    event: React.ChangeEvent<HTMLInputElement>,
    classIndex: number,
    studentIndex: number
  ) => void = (event, classIndex, studentIndex) => {
    let isBoxChecked: boolean =
      pickStates[classIndex][studentIndex] !== undefined;

    let updatedPicks = pickStates.slice();

    //a class was clicked
    if (studentIndex === 0) {
      if (isBoxChecked) {
        updatedPicks[classIndex] = classes[classIndex].students.map(
          (_) => undefined
        );
      } else {
        updatedPicks[classIndex] = [
          parseInt(event.target.name),
          ...classes[classIndex].students.map(
            (student: IStudent) => student.id!
          ),
        ];
      }
    }
    // a student was clicked
    else {
      if (isBoxChecked) {
        updatedPicks[classIndex][0] = undefined;
        updatedPicks[classIndex][studentIndex] = undefined;
      } else {
        updatedPicks[classIndex][studentIndex] = classes[classIndex].students[
          studentIndex - 1
        ].id!;

        if (
          updatedPicks[classIndex].length ===
            classes[classIndex].students.length + 1 &&
          updatedPicks[classIndex].slice(1).every((cell) => cell !== undefined)
        ) {
          updatedPicks[classIndex][0] = classes[classIndex].classId;
        }
      }
    }
    setPickStates(updatedPicks);
    updatePicks(updatedPicks, "students");
  };

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded ? panel : false);
  };

  console.log(pickStates);
  return (
    <>
      {classes.map((cls: classList, i: number) => (
        <Accordion
          square
          expanded={expanded === `panel${i}`}
          onChange={handleChange(`panel${i}`)}
        >
          <AccordionSummary
            aria-controls={`panel${i}d-content`}
            id={`panel${i}d-header`}
          >
            <FormControlLabel
              aria-label={`Pick Class${i}`}
              onClick={(event) => {
                event.stopPropagation();
              }}
              onFocus={(event) => event.stopPropagation()}
              control={
                <Checkbox
                  checked={pickStates[i][0] !== undefined}
                  name={"" + cls.classId}
                  onChange={(event) => handlePick(event, i, 0)}
                />
              }
              label={cls.name}
            />
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset">
              <FormGroup>
                {cls.students.map((s: IStudent, j: number) => (
                  <FormControlLabel
                    aria-label={`Pick Student${j} Class${i}`}
                    control={
                      <Checkbox
                        checked={pickStates[i][1 + j] !== undefined}
                        onChange={(event) => handlePick(event, i, j + 1)}
                        name={"" + s.id}
                      />
                    }
                    label={`${s.firstName} ${s.lastName}`}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
