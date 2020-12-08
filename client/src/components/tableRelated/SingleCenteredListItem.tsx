import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import styled from "styled-components";

interface Props {
  classes: any;
  primary: number | string | undefined | null;
  secondary: number | string | undefined | null;
}

export const SingleCenteredListItem = (props: Props) => (
  <CenteredListItem>
    <ListItemText
      classes={props.classes}
      primary={props.primary}
      secondary={props.secondary}
    />
  </CenteredListItem>
);

const CenteredListItem = styled(ListItem)`
  text-align: center;
`;
