import React, { useContext } from "react";
import { AuthContext } from "../../../helpers";
import styled from "styled-components";
import Notices from "./Notices";
//@ts-ignore
import { TasksFidget, LessonsFidget, ScheduleFidget } from "./DashBoardFidgets";

export default function Dashboard() {
  //@ts-ignore
  const { user } = useContext(AuthContext);
  return (
    <DashboardContainer>
      <TilesRow repeatFormula="1fr 1fr 1fr">
        <InformationTile>
          <TasksFidget />
        </InformationTile>
        <InformationTile>
          <ScheduleFidget />
        </InformationTile>
        <InformationTile>
          <LessonsFidget />
        </InformationTile>
      </TilesRow>
      <Notices />
    </DashboardContainer>
  );
}

const DashboardContainer = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  width: 100%;
  height: 100vh;
`;

const InformationTile = styled.div`
  background-color: red;
  height: auto;
  width: auto;
`;

const TilesRow = styled.div`
  background-color: blue;
  height: ${(props: any) => (props.height ? props.height : "20vh")};
  width: ${(props: any) => (props.width ? props.width : "90vw")};
  display: grid;
  grid-template-columns: ${(props: any) =>
    props.repeatFormula ? props.repeatFormula : "1fr 1fr"};
  grid-gap: 2vw;
  margin: 5vh auto;
`;

const Content = styled.div`
  color: ${({ theme }: { theme: any }) => theme.colors.font};
`;
