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
import styled from 'styled-components';
import { ITaskCriteria, ITaskLabel } from "../../../typescript/interfaces";

// export default function LabelButton({ label }: { label: ITaskLabel }) {
//   const [modalOpen, setModalOpen] = useState<boolean>(false);

//   const handleOpen: () => void = () => {
//     setModalOpen(true);
//   };
//   const handleClose: () => void = () => {
//     setModalOpen(false);
//   };

//   return (
//     <>
//       <LabelView open={modalOpen} handleClose={handleClose} label={label} />
//       <span onClick={handleOpen}>{label.name}</span>
//     </>
//   );
// }

export function LabelView({
  label,
}: {
  label: ITaskLabel;
}) {
  const [criteria, setCriteria] = useState<ITaskCriteria[]>([]);
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
    label.Criteria.splice(indexToRemove, 1);
    setCriteria(label?.Criteria.slice());
  };

  return (
    <Container>
      <span className="header">{label.name}</span>

        <input
          placeholder="Add Criterion"
          ref={criterionField}
        />
        <button type="button" onClick={addCriterion}>Add</button>

      {criteria[0]
        ? (
        <ul>
          {criteria.map((criterion: ITaskCriteria, i: number) => (
            <li
              key={`criteria${i}`}
              
            >
              {criterion.name}
              <DeleteIcon onClick={() => removeCriterion(criterion)} />
            </li>
          ))}
        </ul>)
        : undefined}
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
    .MuiSvgIcon-root{
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