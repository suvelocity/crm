import React, { useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import languagesJSON from "../helpers/languages.json";
import { Controller } from "react-hook-form";

const languages: Ilanguage[] = Object.keys(languagesJSON).map((key: string) => {
  return {
    //@ts-ignore
    name: languagesJSON[key].name,
    //@ts-ignore
    nativeName: languagesJSON[key].nativeName,
  };
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 500,
      "& > * + *": {
        marginTop: theme.spacing(3),
      },
    },
  })
);

interface Ilanguage {
  name: string;
  nativeName: string;
}

const parseStringToLanguage: (langString: string) => Ilanguage[] = (
  langString: string = ""
) => {
  const parsed: Ilanguage[] = langString.split(", ").map(
    (langName: string) =>
      languages.find((lang: Ilanguage) => lang.name === langName) || {
        name: "",
        nativeName: "",
      }
  );
  return parsed;
};

export default function LanguageSelector({
  name,
  defaultValue,
  inputRef,
  label,
  control,
}: {
  name: string;
  defaultValue: string | null;
  inputRef: any;
  label?: string;
  control: any;
}) {
  const [value, setValue] = useState<Ilanguage[]>(
    defaultValue ? parseStringToLanguage(defaultValue) : [languages[56]]
  );
  const [inputValue, setInputValue] = useState<string>("");

  const classes = useStyles();

  const getOpObj = (option: any) => {
    if (!option.name) option = languages.find((op) => op.name === option);
    return option;
  };

  return (
    <Controller
      as={
        <Autocomplete
          multiple
          id="tags-standard"
          options={languages}
          getOptionLabel={(option: Ilanguage) => option.name}
          includeInputInList
          autoComplete
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Languages" />
          )}
          renderOption={(option: Ilanguage) => {
            return (
              <span key={option.name}>
                <b>{option.name}</b>, {option.nativeName}
              </span>
            );
          }}
        />
      }
      name={name}
      control={control}
    />
  );
}
