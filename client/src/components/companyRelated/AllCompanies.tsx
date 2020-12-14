import React, { useState, useEffect } from "react";
import network from "../../helpers/network";
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
} from "../../styles/styledComponents";
import Button from "@material-ui/core/Button";
import { ICompany } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import BusinessIcon from "@material-ui/icons/Business";
import { capitalize } from "../../helpers/general";

function AllCompanies() {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { data } = await network.get("/api/v1/company/all");
      setCompanies(data);
      setLoading(false);
    })();
  }, []);

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1 color="#b0b050">All Companies</H1>
        </TitleWrapper>
        <br />
        <StyledLink to="/company/add">
          <Button
            variant="contained"
            style={{ backgroundColor: "#b0b050", color: "white" }}
          >
            Add Company
          </Button>
        </StyledLink>
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {companies && (
            <li>
              <TableHeader repeatFormula="1fr 2.5fr 2.5fr 1fr">
                <BusinessIcon />
                <StyledSpan weight="bold">Name</StyledSpan>
                <StyledSpan weight="bold">Location</StyledSpan>
                <StyledSpan weight="bold">Contact Name</StyledSpan>
              </TableHeader>
            </li>
          )}
          {companies &&
            companies.map((company) => (
              <li>
                <StyledLink to={`/company/${company.id}`} color="black">
                  <StyledDiv repeatFormula="1fr 2.5fr 2.5fr 1fr">
                    <BusinessIcon />
                    <StyledSpan weight="bold">
                      {capitalize(company.name)}
                    </StyledSpan>
                    <StyledSpan>{capitalize(company.location)}</StyledSpan>
                    <StyledSpan>{company.contactName}</StyledSpan>
                  </StyledDiv>
                </StyledLink>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
}

export default AllCompanies;
