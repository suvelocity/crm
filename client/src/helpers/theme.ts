import { lightTheme, darkTheme } from "./themes";
import { ThemeType } from "../typescript/interfaces";

export const theme = (currentTheme: ThemeType) => {
  switch (currentTheme) {
    case "light":
      return lightTheme;
    case "dark":
      return darkTheme;
  }
};
