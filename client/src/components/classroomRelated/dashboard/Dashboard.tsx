import React, { useContext } from "react";
import { AuthContext } from "../../../helpers";
import styled from "styled-components";
import Notices from "./Notices";

export default function Dashboard() {
  //@ts-ignore
  const { user } = useContext(AuthContext);
  console.log(user);

  return (
    <DashboardContainer>
      <Notices />
    </DashboardContainer>
  );
}

const DashboardContainer = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.background};
  width: 100%;
  height: 100vh;
`;

const Content = styled.div`
  color: ${({ theme }: { theme: any }) => theme.colors.font};
`;
