import { network } from "../../../helpers";
import React, { Dispatch } from "react";
import Select from "react-select/async";
import { taskType } from "../../../typescript/interfaces";
import { InputLabel } from "@material-ui/core";

export type challengeData = {
  id: number | string;
  name: string;
  link?: string;
};
export type ChallengeSelectorProps = {
  selectedValue?: string;
  changeValue: (value: any, fieldToChange: string) => void;
  type: taskType;
};

const generateURL: { [key: string]: (id: string) => string } = {
  challengeMe(id: string) {
    return "http://35.239.15.221/challenges/" + id;
  },
  fcc(link: string) {
    return "https://www.freecodecamp.org/" + link;
  },
  quiz(id: string) {
    return "localhost:3000/quizme/" + id;
  },
};
function ChallengeSelector({
  selectedValue,
  changeValue,
  type,
}: ChallengeSelectorProps): JSX.Element | null {
  const loadChallenges = async (query: string) => {
    try {
      const { data } = await network.get(
        `/api/v1/task/challenges/${type}?name=${query}`
      );
      if (data.status === "error") {
        throw data.message;
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  let site = "";
  switch (type) {
    case "challengeMe":
      site = "ChallengeMe";
      break;
    case "fcc":
      site = "Free Code Camp";
      break;
    case "quiz":
      site = "QuizMe";
      break;
  }
  return type !== "manual" ? (
    <>
      <InputLabel
        id="challenge-label"
        shrink={true}
        style={{ backgroundColor: "white" }}
      >
        Challenge Selection*
      </InputLabel>
      <Select
        key={type}
        styles={{
          menu: (provided) => {
            return { ...provided, opacity: 1, zIndex: 20 };
          },
          container: (provided) => {
            return { ...provided, margin: "5px 0" };
          },
          control: (provided) => {
            return { ...provided, height: 50 };
          },
        }}
        isClearable
        on
        defaultOptions={true}
        backspaceRemovesValue={false}
        placeholder={`search in ${site}`}
        loadOptions={loadChallenges}
        onChange={(value, action) => {
          if (action.action === "clear") {
            changeValue(null, "externalId");
            changeValue(null, "externalLink");
          }
          if (value) {
            const { value: id, label: name, link } = value;
            changeValue(id, "externalId");
            changeValue(name, "title");
            let url = "";
            if (type === "fcc") {
              url = generateURL[type](link);
              changeValue(url, "externalLink");
            } else {
              url = generateURL[type](id);
              changeValue(url, "externalLink");
            }
          }
        }}
      />
    </>
  ) : null;
}
export default ChallengeSelector;
