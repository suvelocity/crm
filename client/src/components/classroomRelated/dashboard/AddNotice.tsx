import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { INotice } from "../../../typescript/interfaces";
import Swal from "sweetalert2";
import network from "../../../helpers/network";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { AuthContext } from "../../../helpers";

export default function AddNotice({
  // updateLocal,
  closeModal,
  classId,
  loadNotices,
}: {
  // updateLocal: React.Dispatch<React.SetStateAction<INotice[]>>;
  closeModal: () => void;
  classId: number | undefined;
  loadNotices: Function;
}) {
  const { user }: any = useContext(AuthContext);
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
        classId,
        type,
        body,
        createdBy: user.id,
      });
      Swal.fire("Success", "Notice Added :)", "success").then(
        (_) => loadNotices && loadNotices()
      );
      // updateLocal((prev: INotice[]) => prev?.concat(data));
    } catch (error) {
      Swal.fire("Error Occurred", error.message, "error");
    } finally {
      closeModal();
    }
  };
  return (
    <div id='post-notice' style={{ display: "flex", flexDirection: "column" }}>
      <FormControl>
        <InputLabel id='demo-controlled-open-select-label'>Type</InputLabel>
        <Select
          labelId='demo-controlled-open-select-label'
          id='demo-controlled-open-select'
          open={open}
          style={{ padding: "5px", marginBottom: "10px" }}
          variant='outlined'
          onClose={handleClose}
          onOpen={handleOpen}
          value={type}
          onChange={handleChange}>
          <MenuItem value={"regular"}>regular</MenuItem>
          <MenuItem value={"important"}>important</MenuItem>
          {/* <MenuItem value={"critical"}>critical</MenuItem> */}
        </Select>
      </FormControl>
      <TextField
        style={{ padding: "5px", marginBottom: "10px" }}
        onChange={(e) => {
          setBody(e.target.value);
        }}
        id='outlined-multiline-static'
        label='notice'
        multiline
        rows={5}
        // defaultValue='Default Value'
        variant='outlined'
      />

      <Button variant='outlined' color='inherit' onClick={sendNotice}>
        send
      </Button>
    </div>
  );
}
