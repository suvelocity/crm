import React from "react";
import { ErrorOutline as ErrorOutlineIcon } from "@material-ui/icons";
import { iconStyle, errorIconStyle } from "../../styles/styledComponents";
import { IconButton, Tooltip } from "@material-ui/core";

interface Props {
  tooltipTitle: string;
}

export const ErrorBtn = (props: Props) => (
  <Tooltip title={props.tooltipTitle}>
    <IconButton style={iconStyle}>
      <ErrorOutlineIcon style={errorIconStyle} color="error" />
    </IconButton>
  </Tooltip>
);
