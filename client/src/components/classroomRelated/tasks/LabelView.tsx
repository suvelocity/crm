import {
  createStyles,
  FormControl,
  makeStyles,
  Modal,
  TextField,
  Theme,
} from "@material-ui/core";
import { Height } from "@material-ui/icons";
import React, { useRef, useState } from "react";

export default function LabelButton({ label }: { label: string }) {
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
      <button onClick={handleOpen}>{label}</button>
    </>
  );
}

function LabelView({
  label,
  open,
  handleClose,
}: {
  label: string;
  open: boolean;
  handleClose: () => void;
}) {
  const [criterionModalOpen, setCriterionModalOpen] = useState<boolean>(false);
  const [criteria, setCriteria] = useState<string[]>([]);
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
    if (criteria.find((c) => c === newCriterion)) alert("Criterion exists");
    else {
      setCriteria((prev: string[]) => prev.concat(newCriterion));
      //@ts-ignore
      criterionField.current.value = "";
    }
    //@ts-ignore
    criterionField.current.focus();
  };

  const removeCriterion: (criterionToRemove: string) => void = (
    criterionToRemove: string
  ) => {
    setCriteria((prev: string[]) =>
      prev.filter((c: string) => c !== criterionToRemove)
    );
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <>
        {/*@ts-ignore */}
        <div style={modalStyle} className={classes.paper}>
          <h1>{label}</h1>
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
            ? criteria.map((criterion: string, i: number) => (
                <li
                  key={`criteria${i}`}
                  onClick={() => removeCriterion(criterion)}
                >
                  {criterion}
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
