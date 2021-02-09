import React, { useEffect } from "react";
import Teacher from "./Teacher";

import Notices from "../dashboard/Notices";
import styled from "styled-components";
import network from "../../../helpers/network";

export default function TeacherContainer() {
  // const [doneLoading]
  // useEffect(() async => {
  //   const {data} = await network.get("/api/v1/event/updates");
  // }, []);
  return (
    <TeacherTasksContainer>
      <Teacher />
    </TeacherTasksContainer>
  );
}
const TeacherTasksContainer = styled.div`
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  margin-bottom: 10px;
`;
