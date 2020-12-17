import React, { useContext } from "react";
import { AuthContext } from "../../../helpers";
import styled from "styled-components";
import { IUser } from "../../typescript/interfaces";
import Notices from "./Notices";
import {
  H1,
  Wrapper,
  TitleWrapper,
  StyledLink,
  Center,
  StyledSpan,
  StyledUl,
  StyledDiv,
  TableHeader,
  repeatFormula,
} from "../../../styles/styledComponents";

export default function Dashboard() {
  //@ts-ignore
  const { user } = useContext(AuthContext);
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
