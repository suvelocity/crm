import React from "react";
import styled from "styled-components";
import { ILesson } from "../../typescript/interfaces";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function Lesson({
  lesson,
  index,
}: {
  lesson: ILesson;
  index: number;
}) {
  return (
    <LessonContainer>
      <div>
        <StyledAccordion>
          <StyledSummery
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            {"#" + (index + 1) + " " + lesson.title}
          </StyledSummery>
          <hr />
          <StyledDetails>{lesson.body}</StyledDetails>
        </StyledAccordion>
      </div>
    </LessonContainer>
  );
}

const LessonContainer = styled.div`
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  overflow: hidden;
`;

const StyledAccordion = styled(Accordion)`
  background-color: ${({ theme }: { theme: any }) =>
    theme.colors.accordion}; //TODO change
  width: 100%;
`;
const StyledSummery = styled(AccordionSummary)`
  color: ${({ theme }: { theme: any }) => theme.colors.font}; //TODO change
  font-weight: bold;
  font-size: 20px;
`;

const StyledDetails = styled(AccordionDetails)`
  color: ${({ theme }: { theme: any }) => theme.colors.font}; //TODO change
`;
