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
export default function Task({ task, index }: { task: Task; index: number }) {
  const [challengeType, setChallengeType] = useState<string>("menual");
  const [challenge, setChallenge] = useState<string>("");

  const [link, setLink] = useState<string>("");
  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };
  console.log("====================================");
  console.log(task);
  console.log("====================================");
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setChallengeType(event.target.value as string);
  };

  const handleChallengeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setChallenge(event.target.value as string);
  };

  return (
    <div>
      <div>name: {task.body}</div>
      <Select value={challengeType} onChange={handleChange}>
        <MenuItem value={"menual"}>menual</MenuItem>
        <MenuItem value={"challengeMe"}>challengeMe</MenuItem>
        <MenuItem value={"fcc"}>fcc</MenuItem>
      </Select>
      {challengeType === "menual" ? (
        <input onChange={handleLinkChange} placeholder='link to task' />
      ) : (
        <Select value={challenge} onChange={handleChallengeChange}>
          <MenuItem value={"menual"}>menual</MenuItem>
          <MenuItem value={"challengeMe"}>challengeMe</MenuItem>
          <MenuItem value={"fcc"}>fcc</MenuItem>
        </Select>
      )}
    </div>
  );
}
