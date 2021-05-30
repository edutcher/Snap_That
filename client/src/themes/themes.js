import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const lightTheme = () =>
  responsiveFontSizes(
    createMuiTheme({
      palette: {
        type: "light",
      },
    })
  );

const darkTheme = () =>
  responsiveFontSizes(
    createMuiTheme({
      palette: {
        type: "dark",
      },
    })
  );

export { lightTheme, darkTheme };
