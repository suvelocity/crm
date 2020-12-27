import React, { useCallback, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EmailIcon from "@material-ui/icons/Email";
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  GridDiv,
  EditDiv
} from "../../../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import DialpadIcon from "@material-ui/icons/Dialpad";
import { useParams } from "react-router-dom";
import network from "../../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IMentor } from "../../../typescript/interfaces";
import BusinessIcon from "@material-ui/icons/Business";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';
import WcIcon from "@material-ui/icons/Wc";
import WorkIcon from "@material-ui/icons/Work";
import EditIcon from "@material-ui/icons/Edit";
import { capitalize } from "../../../helpers/general";
import { formatPhone } from "../../../helpers/general";
import AddMentor from "./AddMentor";
import Modal from "@material-ui/core/Modal";

const SingleMentor: React.FC = () => {
  const [mentor, setMentor] = useState<IMentor[] | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [ModalState, setModalState] = useState<boolean>(false)
  const id = Number(useParams<{id:string}>().id);

  const getMentor = useCallback(async () => {
    const { data }: { data: IMentor[] } = await network.get(
      `/api/v1/M/mentor/${id}`
    );
    console.log(data);
    
    setMentor(data);
    setLoading(false);
  }, [id, setMentor, setLoading]);

  const handleClose = () => {
    setModalState(false);
    setLoading(true);
    getMentor();
  };

  useEffect(() => {
    try {
      getMentor();
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <Wrapper width="80%">
        <Center>
          <TitleWrapper>
            <H1 color={"#c47dfa"}>Mentor Info</H1>
          </TitleWrapper>
        </Center>
        <Loading size={30} loading={loading}>
        <EditDiv onClick={() => setModalState(true)}>
            <EditIcon />
          </EditDiv>
          {mentor && mentor[0] && (
            <>
            <GridDiv repeatFormula="1fr 1fr 1fr">
              <List>
                {/* {Name} */}
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Name"
                    secondary={capitalize(mentor[0]?.name)}
                  />
                </ListItem>
                {/* Email */}
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={mentor[0]?.email} />
                </ListItem>
                {/* Phone number */}
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Number"
                    secondary={formatPhone(mentor[0]?.phone)}
                  />
                </ListItem>
                {/* Id number */}
                <ListItem>
                  <ListItemIcon>
                    <DialpadIcon />
                  </ListItemIcon>
                  <ListItemText primary="ID Number" secondary={mentor[0]?.id} />
                </ListItem>
              </List>
              <List>
                {/* Address */}
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Address"
                    secondary={capitalize(mentor[0]?.address)}
                  />
                </ListItem>
                {/* company */}
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Company"
                    secondary={capitalize(mentor[0]?.company)}
                  />
                </ListItem>
                {/* role */}
                <ListItem>
                  <ListItemIcon>
                    <WorkOutlineIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Role"
                    secondary={capitalize(mentor[0]?.role)}
                  />
                </ListItem>
                {/* experience */}
                <ListItem>
                  <ListItemIcon>
                    <HourglassEmptyOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Experience"
                    secondary={mentor[0]?.experience}
                  />
                </ListItem>
              </List>
              <List>
                {/* gender */}
                <ListItem>
                  <ListItemIcon>
                    <WcIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Gender"
                    secondary={capitalize(mentor[0]?.gender)}
                  />
                </ListItem>
                {/* programs */}
                {mentor[0]?.MentorStudents![0] && (
                  <>
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIndIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="programs"
                      secondary={mentor[0]?.MentorStudents.map((program) => {
                        return <div>{capitalize(program.MentorProgram!.name)}</div>
                      })}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AssignmentIndIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="students"
                      secondary={mentor[0]?.MentorStudents.map((program) => {
                        return <div>{`${capitalize(program.Student!.firstName)} ${capitalize(program.Student!.lastName)}`}</div>
                      })}
                    />
                  </ListItem>
                  </>
                )}
              </List>
            </GridDiv>
            <Modal
            open={ModalState}
            onClose={() => setModalState(false)}
            style={{ overflow: "scroll" }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {!mentor ? (
              <div>oops</div>
            ) : (
              <AddMentor
                handleClose={handleClose}
                update={true}
                mentor={mentor[0]}
                header="Edit Mentor"
              />
            )}
              </Modal>
              </>
          )}
        </Loading>
      </Wrapper>
    </>
  );
};

export default SingleMentor;
