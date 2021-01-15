import {
  createStyles,
  FormControl,
  makeStyles,
  Modal,
  TextField,
  Theme,
} from "@material-ui/core";
import React, { useRef, useState } from "react";
import { ITaskCriteria, ITaskLabel } from "../../../typescript/interfaces";

export default function LabelButton({ label }: { label: ITaskLabel }) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpen: () => void = () => {
    setModalOpen(true);
  };
  const handleClose: () => void = () => {
    setModalOpen(false);
  };

  return (
    <>
      <LabelView open={modalOpen} handleClose={handleClose} label={label} />
      <span onClick={handleOpen}>{label.name}</span>
    </>
  );
}

function LabelView({
  label,
  open,
  handleClose,
}: {
  label: ITaskLabel;
  open: boolean;
  handleClose: () => void;
}) {
  const [criterionModalOpen, setCriterionModalOpen] = useState<boolean>(false);
  const [criteria, setCriteria] = useState<ITaskCriteria[]>([]);
  const classes = useStyles();

  const criterionField = useRef(null);
  const handleCriterionClose: () => void = () => {
    setCriterionModalOpen(false);
  };

  const handleCriterionOpen: () => void = () => {
    setCriterionModalOpen(true);
  };

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
    <Modal open={open} onClose={handleClose}>
      <>
        {/*@ts-ignore */}
        <div style={modalStyle} className={classes.paper}>
          <h1>{label.name}</h1>
          <FormControl
            id="criteria"
            variant="outlined"
            // className={classes.formControl}
          >
            {" "}
            <TextField
              variant="outlined"
              label="Add Criterion"
              inputRef={criterionField}
            />
            <button onClick={addCriterion}>Add</button>
          </FormControl>
          {/* <button onClick={handleCriterionOpen}>Add Criterion</button>
          <CriterionModal
            open={criterionModalOpen}
            handleClose={handleCriterionClose}
          /> */}
          {criteria[0]
            ? criteria.map((criterion: ITaskCriteria, i: number) => (
                <li
                  key={`criteria${i}`}
                  onClick={() => removeCriterion(criterion)}
                >
                  {criterion.name}
                </li>
              ))
            : "No criteria added"}
        </div>
      </>
    </Modal>
  );
}

function CriterionModal({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const classes = useStyles();

  return (
    <Modal open={open} onClose={handleClose}>
      <>
        {/*@ts-ignore */}
        <div style={modalStyle} className={classes.paper}>
          <span>"I am edit modal"</span>
        </div>
      </>
    </Modal>
  );
}

const modalStyle = {
  top: `50%`,
  left: `50%`,
  transform: `translate(-${50}%, -${50}%)`,
  overflowY: "scroll",
};

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
