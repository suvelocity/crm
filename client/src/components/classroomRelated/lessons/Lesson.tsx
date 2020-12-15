import React from "react";
import styled from "styled-components";
import { ILesson } from "../../../typescript/interfaces";
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
          <StyledDetails>
            <ResourcesLinks>
              {lesson.resource?.includes("%#splitingResource#%")
                ? lesson.resource
                    .split("%#splitingResource#%")
                    .map((resource: string, index: number) => (
                      <ResourcesLink key={index}>
                        <Link target='_blank' href={resource}>
                          {resource}
                        </Link>
                      </ResourcesLink>
                    ))
                : //@ts-ignore
                  lesson.resource?.length > 0 && (
                    //@ts-ignore
                    <Link target='_blank' href={resource!}>
                      {lesson.resource}
                    </Link>
                  )}
            </ResourcesLinks>
          </StyledDetails>
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

const ResourcesLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ResourcesLink = styled.div`
  margin-top: 15px;
`;

const Link = styled.a`
  background-color: #3f51b5;
  text-decoration: none;
  color:${({ theme }: { theme: any }) => theme.colors.font}};
  border-radius: 8px;
  padding: 5px;
  color: white;
`;
