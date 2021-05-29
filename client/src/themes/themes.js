import { createMuiTheme } from "@material-ui/core/styles";

const lightTheme = () =>
  createMuiTheme({
    palette: {
      type: "light",
    },
  });

const darkTheme = () =>
  createMuiTheme({
    palette: {
      type: "dark",
    },
  });

export { lightTheme, darkTheme };
