import styled from "styled-components";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";

export const H1 = styled.h1`
  padding: 5px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 27px;
  color: white;
  position: relative;
  left: -50%;
  top: -80px;
  background-color: ${(props: { color: string }) =>
    props.color === "red" ? "#bb4040" : " #3f51b5"};
  border-radius: 5px;
  padding: 10px;
  min-width: 180px;
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  z-index: 2;
`;

export const TitleWrapper = styled.div`
  position: absolute;
  left: 50%;
`;

export const Wrapper = styled.div`
  margin: 5% auto;
  width: 70%;
  padding: 40px;
  border-radius: 7px;
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  min-width: 300px;
  max-width: 700px;
`;

export const Center = styled.div`
  text-align: center;
`;

export const StyledLink = styled(Link)`
  color: ${(props: { color: string }) => (props.color ? props.color : "white")};
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
  grid-template-columns: 1fr 1fr;
`;
