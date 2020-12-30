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

export default function Dashboard() {
  //@ts-ignore
  const { user } = useContext(AuthContext);

  return (
    <DashboardContainer>
      <img
        src={scaleup}
        style={{
          width: "50%",
          opacity: "80%",
          marginTop: "2%",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}></img>
      <Notices />
    </DashboardContainer>
  );
}

const DashboardContainer = styled.div`
  /* background-color: ${({ theme }: { theme: any }) =>
    theme.colors.background};
  color: ${({ theme }: { theme: any }) => theme.colors.font}; */
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const InformationTile = styled.div`
  /* max-height: 40vh; */
  /* overflow-y: auto; */
  height: auto;
  width: auto;
`;
// background-color: red;

// background-color: blue;
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
