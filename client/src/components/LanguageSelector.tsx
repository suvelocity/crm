import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import languagesJSON from "../helpers/languages.json";
import parse from "autosuggest-highlight/parse";

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
export default function LanguageSelector() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple
        // style={{ width: "200px" }}
        id="tags-standard"
        options={languages}
        getOptionLabel={(option: Ilanguage) => option.name}
        defaultValue={[languages[56]]}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="Multiple values" />
        )}
        renderOption={(option: Ilanguage) => {
          return (
            <span>
              <b>{option.name}</b>, {option.nativeName}
            </span>
          );
        }}
      />
    </div>
  );
}
