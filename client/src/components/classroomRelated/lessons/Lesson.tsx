import React from "react";
import styled from "styled-components";
import { ILesson } from "../../../typescript/interfaces";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { EditDiv } from "../../../styles/styledComponents";
import { useState, useCallback } from "react";
import { Loading } from "react-loading-wrapper";
import EditIcon from "@material-ui/icons/Edit";
import AddLesson from "./AddLesson";
import network from "../../../helpers/network";
import Modal from "@material-ui/core/Modal";
import { modalStyle, useStyles } from "./Lessons";

export default function Lesson({
  lesson,
  index,
}: {
  lesson: ILesson;
  index: number;
}) {
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [lessonState, setLessonState] = useState<ILesson>(lesson);
  const classes = useStyles();
  const getLesson = useCallback(async () => {
    try {
      const { data } = await network.get(`/api/v1/lesson/byId/${lesson.id}`);
      setLessonState(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [loading]);
  const handleClose = () => {
    setModalState(false);
    setLoading(true);
    getLesson();
  };
  const body = (
    //@ts-ignore
    <div style={modalStyle} className={classes.paper}>
      <AddLesson
        handleClose={handleClose}
        setOpen={setModalState}
        update={true}
        lesson={lessonState}
        header='Edit Lesson'
      />
    </div>
  );

  return (
    <LessonContainer>
      <div>
        <StyledAccordion>
          <StyledSummery
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            {"#" + (index + 1) + " " + lessonState.title}
          </StyledSummery>
          <hr />
          <StyledDetails>{lessonState.body}</StyledDetails>
          <StyledDetails>
            <Loading size={30} loading={loading}>
              <EditDiv onClick={() => setModalState(true)}>
                <EditIcon />
              </EditDiv>
              <ResourcesLinks>
                {lessonState.resource?.includes("%#splitingResource#%")
                  ? lessonState.resource
                      .split("%#splitingResource#%")
                      .map((resource: string, index: number) => (
                        <ResourcesLink key={index}>
                          <Link target='_blank' href={resource}>
                            {resource}
                          </Link>
                        </ResourcesLink>
                      ))
                  : //@ts-ignore
                    lessonState.resource?.length > 0 && (
                      //@ts-ignore
                      <Link target='_blank' href={lessonState.resource}>
                        {lessonState.resource}
                      </Link>
                    )}
              </ResourcesLinks>
            </Loading>
          </StyledDetails>
        </StyledAccordion>
        <Modal
          open={modalState}
          onClose={() => setModalState(false)}
          aria-labelledby='simple-modal-title'
          aria-describedby='simple-modal-description'>
          {body}
        </Modal>
      </div>
    </LessonContainer>
  );
}

const LessonContainer = styled.div`
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  overflow: hidden;
  margin-bottom: 10px;
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
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  border-radius: 8px;
  padding: 5px;
  color: white;
`;
