import styled from "styled-components";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import { ListItem } from "@material-ui/core";

export const errorIconStyle = { width: "30px", height: "30px" };

export const iconStyle = { cursor: "default" };

export const repeatFormula = "1fr 2.5fr 2.5fr 1fr";

export const H1 = styled.h1`
  padding: 10px 20px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
  color: white;
  /* position: relative; */
  /* left: -50%;
  top: -80px; */
  margin: 0;
  display: inline;
  background-color: ${(props: { color: string }) =>
    props.color ? props.color : "#3f51b5"};
  border-radius: 5px;
  min-width: 180px;
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  z-index: 2;
`;

export const TitleWrapper = styled.div`
  /* position: absolute; */
  /* left: 50%; */
  /* top: 50%; */
  /* width: 50%; */
  height: 0px;
  transform: translate(0, -52px);
`;

export const Wrapper = styled.div`
  margin: ${(props: { margin: string }) =>
    props.margin ? props.margin : "5% auto"};
  width: 80%;
  padding: ${(props: { padding: string }) =>
    props.padding ? props.padding : "40px"};
  border-radius: 7px;
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  min-width: 300px;
  max-width: ${(props: { width: string }) =>
    props.width ? props.width : "700px"};
  background-color: ${(props: { backgroundColor: string }) =>
    props.backgroundColor ? props.backgroundColor : "white"};
  color: ${(props: { color: string }) => (props.color ? props.color : "black")};
  position: relative;
`;

export const Center = styled.div`
  text-align: center;
`;

export const StyledLink = styled(Link)`
  color: ${(props: { color: string }) => (props.color ? props.color : "white")};
  background-color: "transparent";
  /* background-color: ${(props: { background: string }) =>
    props.background ? props.background : "transparent"}; */
  text-decoration: ${(props: { textDecoration: string }) =>
    props.textDecoration ? "underline" : "none"};
`;

export const RemoveJobButton = styled(DeleteIcon)`
  color: #cf1d1d;
  transition: 200ms;

  &:hover {
    color: red;
    background-color: rgba(99, 99, 99, 0.1);
    border-radius: 50%;
    box-shadow: 0px 0px 0 10px rgba(99, 99, 99, 0.1);
  }
`;

export const GridDiv = styled.div`
  display: grid;
  width: 95%;
  grid-template-columns: ${(props: { repeatFormula: string }) =>
    props.repeatFormula ? props.repeatFormula : "1fr 1fr"};
`;

export const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: ${(props: { repeatFormula: string }) =>
    props.repeatFormula ? props.repeatFormula : "1fr 2.5fr 2fr 2.5fr 2fr"};
  padding: 10px;
  align-items: center;
  background-color: rgba(180, 180, 180, 0.05);
  transition: 150ms;
  border-radius: 2px;
  margin: 2px;
  &:hover {
    background-color: rgba(201, 201, 201, 0.38);
  }
`;

export const StyledSpan = styled.span`
  font-size: 16px;
  padding-right: 7px;
  font-weight: ${(props: { weight: string }) =>
    props.weight === "bold" && "bold"};
`;

export const TableHeader = styled(StyledDiv)`
  background-color: rgba(20, 20, 25, 0.6);
  color: white;
  &:hover {
    background-color: rgba(20, 20, 25, 0.6);
  }
`;

export const StyledUl = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const MultilineListItem = styled(ListItem)`
  white-space: pre-wrap;
`;

export const StyledSelect = styled.select`
  width: 100%;
  min-width: 50px;
  max-width: 300px;
  border: 1px solid yellowgreen;
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;
  background-color: #fff;
  align-items: center;
  position: relative;

  ::after {
    width: 0.8em;
    height: 0.5em;
    background-color: #fff;
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    justify-self: end;
  }
`;

export const EditDiv = styled.div`
  cursor: pointer;
  position: absolute;
  right: 33px;
  top: ${(props: { top: string }) => props.top || "30px"};
`;

export const RegisterToCM = styled.div`
  cursor: pointer;
  position: absolute;
  right: 33px;
  top: ${(props: { top: string }) => props.top || "60px"};
`;

export const StyledAtavLink = styled.a`
  cursor: pointer;
  transition: 0.2s;
  :hover {
    text-decoration: none;
    color: rgb(20, 35, 220);
  }
  :visited,
  :focus,
  :active,
  :any-link {
    text-decoration: none;
    color: black;
  }
`;

export const Hoverable = styled.div`
  cursor: pointer;
  transition: 0.2s;
  :hover {
    color: #696d69;
    transform: translateY(-5px);
  }
`;
