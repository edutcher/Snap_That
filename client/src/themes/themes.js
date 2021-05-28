import { createMuiTheme } from "@material-ui/core/styles";

const lightTheme = () =>
  createMuiTheme({
    palette: {
      root: {
        background: "#FFFFFFF",
      },
      background: {
        color: "#FFFFFF",
      },
      primary: {
        main: "#00FF00",
      },
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
