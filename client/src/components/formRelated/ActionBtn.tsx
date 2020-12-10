import React from "react";
import { Done as DoneIcon } from "@material-ui/icons";
import { iconStyle } from "../../styles/styledComponents";
import { IconButton } from "@material-ui/core";

export const ActionBtn = () => (
  <IconButton style={iconStyle}>
    <DoneIcon color='action' />
  </IconButton>
);
