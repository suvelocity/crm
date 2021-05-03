import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import network from "../../../helpers/network";
import TextField from "@material-ui/core/TextField";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import StarIcon from '@material-ui/icons/Star';
import StarOutlineIcon from '@material-ui/icons/StarOutline';

export default function SubmitTask(props: any) {
  const { taskId, handleClose, handleSubmit, submitLink } = props;
  const [url, setUrl] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rank, setRank] = useState(0)
  
  
  //   const handleClose = () => {
    //     setOpen(false);
    //   };
  const Rank = (props: any) => {
    const { rank, setRank } = props;
    const [rankDisplay, setRankDisplay] = useState([false, false, false, false, false])
    const hoverHandler = (rank: number) => {
      const newRanks = rankDisplay.map((v: Boolean, i: number) => i < rank)
      setRankDisplay(newRanks)
    }
    const clickHandler = (rank: number) => {
      setRank(rank)
    }

    return (
      <div id="rank" style={{ display: 'flex', justifyContent: 'end', marginBottom: '0.5rem'}}>



            {rankDisplay.map((rank, i) => {
                return <div key={i} className={`star${rank ? "-picked" : ""}`} onClick={() => clickHandler(i + 1)}
                    onMouseEnter={() => { hoverHandler(i + 1) }}>
                    {rank ? <StarIcon /> : <StarOutlineIcon />}
                </div>
            })
            }

        </div>
    )
  }
  return (
    <div id='post-notice' style={{ display: "flex", flexDirection: "column"}}>
      <Rank rank={rank} setRank={setRank} />
      <TextField
        onChange={(e) => {
          setUrl(e.target.value)
        }
        }
        id='outlined-multiline-static'
        label='url to submit'
        defaultValue = {submitLink || ""}
        multiline
        rows={1}
        variant='outlined'
      />
      <TextField
         onChange={(e) => {
          setFeedback(e.target.value)
        }
        }
        id='outlined-multiline-static'
        label='feedback on this task'
        defaultValue = {submitLink || ""}
        multiline
        rows={10}
        variant='outlined'
        style={{margin: '1rem 0'}}
      />

      <Button
        variant='contained'
        color='primary'
        onClick={() => {
          handleSubmit(url, feedback);
        }}>
        Submit
      </Button>
    </div>
  );

}
