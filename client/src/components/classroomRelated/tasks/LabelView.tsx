import {
  createStyles,
  FormControl,
  makeStyles,
  Modal,
  TextField,
  Theme,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React, { CSSProperties, useRef, useState } from "react";
import styled from "styled-components";
import { ITaskCriteria, ITaskLabel } from "../../../typescript/interfaces";

export function LabelView({ label }: { label: ITaskLabel }) {
  const [criteria, setCriteria] = useState<ITaskCriteria[]>(label.Criteria);
  const classes = useStyles();

  const criterionField = useRef(null);
  const addCriterion: () => void = () => {
    //@ts-ignore
    const newCriterion: string = criterionField.current.value;

    if (!newCriterion) {
      alert("Can't add empty criterion");
      return;
    }
    if (label.Criteria.find((c: ITaskCriteria) => c.name === newCriterion))
      alert("Criterion exists");
    else {
      label.Criteria.push({ name: newCriterion });
      setCriteria(label?.Criteria.slice());
      //@ts-ignore
      criterionField.current.value = "";
    }
    //@ts-ignore
    criterionField.current.focus();
  };

  const removeCriterion: (criterionToRemove: ITaskCriteria) => void = (
    criterionToRemove: ITaskCriteria
  ) => {
    const indexToRemove: number = label.Criteria.findIndex(
      (c: ITaskCriteria) => c === criterionToRemove
    )!;
    const criterionToRmv: ITaskCriteria = label.Criteria[indexToRemove];
    if (criterionToRmv.id) {
      criterionToRmv.toDelete = true;
    } else {
      label.Criteria.splice(indexToRemove, 1);
    }
    setCriteria(label?.Criteria.slice());
  };

  return (
    <Container>
      <span className="header">{label.Label?.name}</span>

      <input placeholder="Add Criterion" ref={criterionField} />
      <button type="button" onClick={addCriterion}>
        Add
      </button>

      {criteria[0] ? (
        <ul>
          {criteria.map(
            (criterion: ITaskCriteria, i: number) =>
              !criterion.toDelete && (
                <li key={`criteria${i}`}>
                  {criterion.name}
                  <DeleteIcon onClick={() => removeCriterion(criterion)} />
                </li>
              )
          )}
        </ul>
      ) : undefined}
    </Container>
  );
}

const Container = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  .header {
    font-size: 20px;
    margin-right: 10px;
  }
  .MuiOutlinedInput-input {
    height: 31px;
    display: inline-block;
    padding: 5px 10px;
  }
  li {
    height: 30px;
    .MuiSvgIcon-root {
      font-size: 19px;
      cursor: pointer;
      vertical-align: middle;
    }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);
