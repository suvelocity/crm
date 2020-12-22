import React from "react";
import Teacher from "./Teacher";
import Notices from "../dashboard/Notices";
import styled from "styled-components";

export default function TeacherContainer() {
  return (
    <TeacherDashContainer>
      <Notices />
      <Teacher />
    </TeacherDashContainer>
  );
}
const TeacherDashContainer = styled.div`
  color: ${({ theme }: { theme: any }) => theme.colors.font};
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  height: 100vh;
  width: 100%;
  overflow: hidden;
  margin-bottom: 10px;
`;
