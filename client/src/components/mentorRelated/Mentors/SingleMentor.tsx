import React, { useCallback, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EmailIcon from "@material-ui/icons/Email";
import DateRangeIcon from '@material-ui/icons/DateRange';
import {
  H1,
  Wrapper,
  TitleWrapper,
  Center,
  GridDiv,
  EditDiv,
} from "../../../styles/styledComponents";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import DialpadIcon from "@material-ui/icons/Dialpad";
import { useParams } from "react-router-dom";
import network from "../../../helpers/network";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { IMentor, IClass } from "../../../typescript/interfaces";
import BusinessIcon from "@material-ui/icons/Business";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BuildIcon from '@material-ui/icons/Build';
import HourglassEmptyOutlinedIcon from "@material-ui/icons/HourglassEmptyOutlined";
import WcIcon from "@material-ui/icons/Wc";
import WorkIcon from "@material-ui/icons/Work";
import EditIcon from "@material-ui/icons/Edit";
import MenuBookIcon from '@material-ui/icons/MenuBook';
import FaceIcon from '@material-ui/icons/Face';
import { capitalize } from "../../../helpers/general";
import { formatPhone } from "../../../helpers/general";
import AddMentor from "./AddMentor";
import Modal from "@material-ui/core/Modal";


const SingleMentor: React.FC = () => {
  const [mentor, setMentor] = useState<IMentor | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [agreedTo, setAgreedTo] = useState<IClass[]>([]);
  const [ModalState, setModalState] = useState<boolean>(false);
  const { id } = useParams();

  const getMentor = useCallback(async () => {
    const { data }: { data: IMentor[] } = await network.get(
      `/api/v1/M/mentor/${id}`
    );
    setMentor(data[0]);
    setLoading(false);
  }, [id, setMentor, setLoading]);

  const handleClose = () => {
    setModalState(false);
    setLoading(true);
    getMentor();
  };
  const getAgreedToClasses = useCallback(async () => {
    if(mentor && mentor.agreedTo){
      const {data} : {data : IClass[]} = await network.get('/api/v1/class/all-active-classes', {
        params: {
          classIds: mentor.agreedTo.split(', ')
        }
      });
      setAgreedTo(data)
    }
  },[mentor])
  useEffect(() =>{
      getAgreedToClasses()
  } ,[mentor])

  useEffect(() => {
    try {
      getMentor();
    } catch (e) {
      console.log(e.message);
    }
    //eslint-disable-next-line
  }, []);
  const mentoringExperience = (!mentor || !mentor.mentoringExperience) ? [] : mentor.mentoringExperience.split(',').map((exp: string) => <div>
  {capitalize(exp)}
</div>)
  const mentorPrograms = (!mentor  || !mentor.MentorStudents ) ? [] : mentor!.MentorStudents!.map(
    (program) => {
      return (
        <div>
          {capitalize(program.MentorProgram!.name)}
        </div>
      );
    }
  )
  const mentorFields = !mentor ? [] :[
    {
      primary:"Name",
      secondary:capitalize(mentor?.name),
      icon: <PersonIcon />
    },
    {
      primary:"Email",
      secondary:mentor?.email,
      icon: <EmailIcon />
    },
    {
      primary:"Phone Number",
      secondary:formatPhone(mentor?.phone),
      icon: <PhoneIcon />
    },
    {
      primary:"ID Number",
      secondary:mentor?.id,
      icon: <DialpadIcon />
    },
    {
      primary:"Address",
      secondary:capitalize(mentor?.address),
      icon: <BusinessIcon />
    },
    {
      primary:"Company",
      secondary:capitalize(mentor?.company),
      icon: <WorkIcon />
    },
    {
      primary:"Role",
      secondary:capitalize(mentor?.role),
      icon: <WorkOutlineIcon />
    },
    {
      primary:"Experience",
      secondary:mentor?.experience,
      icon: <HourglassEmptyOutlinedIcon />
    },
    {
      primary:"Gender",
      secondary:capitalize(mentor?.gender),
      icon: <DateRangeIcon />
    },
    {
      primary:"age",
      secondary:mentor?.age,
      icon: <WcIcon />
    },
    {
      primary:"Religion Level",
      secondary:capitalize(mentor?.religionLevel),
      icon: <FaceIcon />
    },
    {
      primary:"Preference",
      secondary:mentor?.preference || 'אין',
      icon: <BuildIcon />
    }
  ]
  const outsideGridDiv = !mentor ? [] : [
    {
      primary:"programs",
      secondary: [...mentoringExperience, ...mentorPrograms],
      icon: <AssignmentIndIcon />
    },
    {
      primary:"students",
      secondary:mentor?.MentorStudents?.map(
        (program) => {
          return (
            <div>{`${capitalize(
              program.Student!.firstName
            )} ${capitalize(
              program.Student!.lastName
            )}`}</div>
          );
        }
      ),
      icon: <AssignmentIndIcon />
    },
    {
      primary:"Education",
      secondary:mentor?.education || 'מידע חסר',
      icon: <MenuBookIcon />
    }
  ]
  if(agreedTo.length > 0){
    outsideGridDiv.push({
      primary: 'Agreed to',
      secondary: agreedTo.map((cls: IClass) => {
        return <div>{capitalize(cls.name)}</div>
      }),
      icon : <VerifiedUserIcon />
    })
  }
  const mentorFieldArr = [];
  for(let i = 0, increment = 4; i< mentorFields.length; i+=increment){
    const sliceTo = i + increment;
    if(sliceTo > mentorFields.length){
      mentorFieldArr.push(mentorFields.slice(i, mentorFields.length))
    }else mentorFieldArr.push(mentorFields.slice(i, sliceTo));
  }

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
          {mentor && mentor && (
            <>
              <GridDiv repeatFormula="1fr 1fr 1fr">
                {
                  mentorFieldArr.map((fields:any) => {
                   return <List>
                    {
                      fields.map( (field: any) => {
                        return <ListItem>
                        <ListItemIcon>
                          {field.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={field.primary}
                          secondary={field.secondary}
                        />
                      </ListItem>
                      })
                    }
                    </List>
                  })
                }
              </GridDiv>
              {
                outsideGridDiv.map( (field: any) => {
                  if(field.secondary.length === 0) return null
                  return <ListItem>
                  <ListItemIcon>
                    {field.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={field.primary}
                    secondary={field.secondary}
                  />
                </ListItem>
                })
              }
            </>
          )}
          
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
                mentor={mentor}
                header="Edit Mentor"
              />
            )}
          </Modal>
        </Loading>
      </Wrapper>
    </>
  );
};

export default SingleMentor;
