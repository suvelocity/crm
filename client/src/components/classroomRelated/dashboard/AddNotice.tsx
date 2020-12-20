import React, { 
  useState, 
  useEffect, 
  useCallback, 
  Dispatch,
  SetStateAction
} from "react";
import { INotice } from "../../../typescript/interfaces"; //todo add interface
import { Loading } from "react-loading-wrapper";
import Swal from "sweetalert2";
import network from "../../../helpers/network";
import TextField from "@material-ui/core/TextField";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";

const classIdPlaceHolder = 1;
const createdByPlaceHolder = 1;

export default function AddNotice({
  updateLocal,
  closeModal,
}: {
  updateLocal: React.Dispatch<React.SetStateAction<INotice[] | undefined>>;
  closeModal: () => void;
}) {
  const [notices, setNotices] = useState<INotice[] | null>();
  const [body, setBody] = useState("");
  const [type, setType] = useState("regular");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (event: any) => {
    setType(event.target.value);
  };

  const sendNotice = async () => {
    try {
      const { data }: { data: INotice } = await network.post(`/api/v1/notice`, {
        classId: classIdPlaceHolder,
        type,
        body,
        createdBy: createdByPlaceHolder,
      });
      updateLocal((prev: INotice[] | undefined) => prev?.concat(data));
      //fix this. not clsoing for some reason
    } catch (error) {
      //todo add catch handler

      Swal.fire("Error Occurred", error.message, "error");
    } finally {
      closeModal();
    }
  };
  return (
    <div id="post-notice" style={{ display: "flex", flexDirection: "column" }}>
      <FormControl>
        <InputLabel id="demo-controlled-open-select-label">Type</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={type}
          onChange={handleChange}
        >
          <MenuItem value={"regular"}>regular</MenuItem>
          <MenuItem value={"important"}>important</MenuItem>
          <MenuItem value={"critical"}>critical</MenuItem>
        </Select>
      </FormControl>
      <TextField
        onChange={(e) => {
          setBody(e.target.value);
        }}
        id="outlined-multiline-static"
        label="notice"
        multiline
        rows={5}
        // defaultValue='Default Value'
        variant="outlined"
      />

      <Button variant="contained" color="secondary" onClick={sendNotice}>
        send
      </Button>
    </div>
  );
}
