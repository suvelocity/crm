import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
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
  text-align: center;
  padding: 40px;
  border-radius: 7px;
  box-shadow: 5px 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  min-width: 300px;
  max-width: 700px;
`;
