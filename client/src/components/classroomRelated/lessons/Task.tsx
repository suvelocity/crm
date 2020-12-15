import React, { useState } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

interface Task {
  externalLink?: string;
  createdBy: number;
  endDate: Date;
  type: string;
  body: string;
}

export default function Task({
  task,
  index,
  handleChange,
}: {
  task: Task;
  index: number;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => void;
}) {
  const [challengeType, setChallengeType] = useState<string>("manual");
  const [challenge, setChallenge] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };
  console.log("====================================");
  console.log(task);
  console.log("====================================");
  const handleChangeType = (event: React.ChangeEvent<{ value: unknown }>) => {
    setChallengeType(event.target.value as string);
  };

  const handleChallengeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setChallenge(event.target.value as string);
  };

  return (
    <div>
      <hr />
      <Input
        variant="outlined"
        label="Task name"
        value={task}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(e, "task")
        }
      />
      <div>name: {task.body}</div>
      <Select value={challengeType} onChange={handleChangeType}>
        <MenuItem value="manual">manual</MenuItem>
        <MenuItem value="challengeMe">challengeMe</MenuItem>
        <MenuItem value="fcc">fcc</MenuItem>
      </Select>
      <br />
      {challengeType === "manual" ? (
        <input onChange={handleLinkChange} placeholder="link to task" />
      ) : (
        <Select
          value={challenge}
          onChange={handleChallengeChange}
          defaultValue="pick challenge"
        >
          <MenuItem value={"manual"}>manual</MenuItem>
          <MenuItem value={"challengeMe"}>challengeMe</MenuItem>
          <MenuItem value={"fcc"}>fcc</MenuItem>
        </Select>
      )}
      <hr />
    </div>
  );
}
