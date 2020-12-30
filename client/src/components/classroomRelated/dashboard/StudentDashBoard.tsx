import React, { useContext } from "react";
import { AuthContext } from "../../../helpers";
import styled from "styled-components";
import { IUser } from "../../../typescript/interfaces";
import Notices from "./Notices";
//@ts-ignore
import { TasksFidget, LessonsFidget } from "./DashBoardFidgets";
import dashImg from "../../../media/dashboard.jpg";
import scaleup from "../../../media/scale-up.jpg";
import classroom from "../../../media/classroom-new.jpg";
import { Button, Typography } from "@material-ui/core";

export default function Dashboard() {
  //@ts-ignore

  return (
    <StudentDashboardContainer>
      <LeftContainer>
        <img
          src={scaleup}
          style={{
            width: "80%",
            opacity: "80%",
            marginTop: "5%",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}></img>
        {/* </Typography> */}
        <Notices />
      </LeftContainer>
      <RightContainer>
        <TasksFidget />
        <LessonsFidget />
      </RightContainer>
    </StudentDashboardContainer>
  );
}

const StudentDashboardContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;

const InformationTile = styled.div`
  height: auto;
  width: auto;
`;

const LeftContainer = styled.div`
  width: 50%;
  /* min-height: 100%; */
  max-height: 95vh;
`;
const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  max-width: 50%;
  /* min-height: 100%; */
  max-height: 95vh;
`;

const TilesRow = styled.div`
  /* position: relative; */
  height: ${(props: any) => (props.height ? props.height : "20vh")};
  width: ${(props: any) => (props.width ? props.width : "90vw")};
  /* max-height: 20vh; */
  display: grid;
  grid-template-columns: ${(props: any) =>
    props.repeatFormula ? props.repeatFormula : "1fr 1fr"};
  grid-gap: 2vw;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  padding-top: 30px;
  margin-bottom: 30vh;
`;

const Content = styled.div`
  color: ${({ theme }: { theme: any }) => theme.colors.font};
`;
