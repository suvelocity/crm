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
  repeatFormula,
} from "../../styles/styledComponents";
import Button from "@material-ui/core/Button";
import { IClass } from "../../typescript/interfaces";
import { Loading } from "react-loading-wrapper";
import DeleteIcon from "@material-ui/icons/Delete";
import "react-loading-wrapper/dist/index.css";
import ClassIcon from "@material-ui/icons/Class";
import { capitalize } from "../../helpers";

interface Props {
  header?: string;
  headerColor?: string;
  teacherClasses?: IClass[];
  applyModal?: any;
  removeClass?: Function;
}
function AllClasses({
  teacherClasses,
  header,
  headerColor,
  applyModal,
  removeClass,
}: Props) {
  const [classes, setClasses] = useState<IClass[]>(
    teacherClasses ? teacherClasses : []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (!teacherClasses) {
        const { data } = await network.get("/api/v1/class/all");
        setClasses(data);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <Wrapper width="80%">
      <Center>
        <TitleWrapper>
          <H1 color={headerColor ? headerColor : "#2c6e3c"}>
            {header ? header : "All Classes"}
          </H1>
        </TitleWrapper>
        <br />
        {applyModal ? (
          applyModal
        ) : (
          <StyledLink to="/class/add">
            <Button
              variant="contained"
              style={{ backgroundColor: "#2c6e3c", color: "white" }}
            >
              Add Class
            </Button>
          </StyledLink>
        )}
      </Center>
      <br />
      <Loading loading={loading} size={30}>
        <StyledUl>
          {classes && (
            <li>
              <TableHeader
                repeatFormula={
                  removeClass ? "1fr 2.5fr 2.5fr 1fr 0.5fr" : repeatFormula
                }
              >
                <ClassIcon />
                <StyledSpan weight="bold">Name</StyledSpan>
                <StyledSpan weight="bold">Course</StyledSpan>
                <StyledSpan weight="bold">Cycle number</StyledSpan>
              </TableHeader>
            </li>
          )}
          {classes &&
            classes.map((cls) => (
              <li>
                  <StyledDiv
                    repeatFormula={
                      removeClass ? "7fr 0.2fr" : '1fr'
                    }
                  >
                <StyledLink to={`/class/${cls.id}`} disabled color="black">
                  <StyledDiv
                      repeatFormula={repeatFormula}
                    >
                    <ClassIcon />
                    <StyledSpan weight="bold">
                      {capitalize(cls.name)}
                    </StyledSpan>
                    <StyledSpan>{capitalize(cls.course)}</StyledSpan>
                    <StyledSpan>{cls.cycleNumber}</StyledSpan>
                  </StyledDiv>
                </StyledLink>
                {removeClass && (
                      <StyledSpan>
                        <DeleteIcon onClick={(e) => removeClass(cls.id, e)} />
                      </StyledSpan>
                    )}
                  </StyledDiv>
              </li>
            ))}
        </StyledUl>
      </Loading>
    </Wrapper>
  );
}

export default AllClasses;
