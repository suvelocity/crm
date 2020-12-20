import React from "react";
import styled from "styled-components";
import { ILesson } from "../../../typescript/interfaces";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { EditDiv } from "../../../styles/styledComponents";
import { useState, useCallback, useEffect, useContext } from "react";
import { Loading } from "react-loading-wrapper";
import EditIcon from "@material-ui/icons/Edit";
import AddLesson, { Task } from "./AddLesson";
import network from "../../../helpers/network";
import Modal from "@material-ui/core/Modal";
import { modalStyle, useStyles } from "./Lessons";
import Select from "@material-ui/core/Select";
import { AuthContext } from "../../../helpers";

export default function Lesson({
  lesson,
  index,
  classId,
}: {
  lesson: ILesson;
  index: number;
  classId: number;
}) {
  const [modalState, setModalState] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [lessonState, setLessonState] = useState<ILesson>(lesson);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user }: any = useContext(AuthContext);
  const classes = useStyles();
  const getLessons = useCallback(async () => {
    try {
      const { data } = await network.get(`/api/v1/lesson/byId/${lesson.id}`);
      setLessonState(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [loading]);
  const getTasks = useCallback(async () => {
    try {
      const { data: tasks }: { data: Task[] } = await network.get(
        `/api/v1/lesson/tasks/${lesson.id}`
      );
      setTasks(tasks);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [loading]);
  const handleClose = () => {
    setModalState(false);
    setLoading(true);
    getLessons();
    setLoading(true);
    getTasks();
  };
  useEffect(() => {
    getTasks();
  }, []);
  const body = (
    //@ts-ignore
    <div style={modalStyle} className={classes.paper}>
      <AddLesson
        handleClose={handleClose}
        setOpen={setModalState}
        update={true}
        lesson={lessonState}
        header="Edit Lesson"
        lessonTasks={tasks}
        classId={classId}
      />
    </div>
  );

  return (
    <LessonContainer>
      <div>
        <StyledAccordion>
          <StyledSummery
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            {"#" + (index + 1) + " " + lessonState.title}
          </StyledSummery>
          <hr />
          <StyledDetails>{lessonState.body}</StyledDetails>
          <StyledDetails>
            <Loading size={30} loading={loading}>
              <EditDiv top="90px" onClick={() => setModalState(true)}>
                <EditIcon />
              </EditDiv>
              <ResourcesLinks>
                {lessonState.resource?.includes("%#splitingResource#%")
                  ? lessonState.resource
                      .split("%#splitingResource#%")
                      .map((resource: string, index: number) => (
                        <ResourcesLink key={index}>
                          <Link target="_blank" href={resource}>
                            {resource}
                          </Link>
                        </ResourcesLink>
                      ))
                  : //@ts-ignore
                    lessonState.resource?.length > 0 && (
                      //@ts-ignore
                      <Link target="_blank" href={lessonState.resource}>
                        {lessonState.resource}
                      </Link>
                    )}
              </ResourcesLinks>
              <StyledTask>
                <h1>hello</h1>
              </StyledTask>
            </Loading>
          </StyledDetails>
        </StyledAccordion>
      </div>
      <Modal
        open={modalState}
        onClose={() => setModalState(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </LessonContainer>
  );
}

const StyledTask = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const LessonContainer = styled.div`
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  overflow: hidden;
  margin-bottom: 15px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  padding: 0px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
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
  background-color: #0a1425;
  text-decoration: none;
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  border-radius: 8px;
  padding: 5px;
  color: white;
`;
