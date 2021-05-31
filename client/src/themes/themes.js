import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const lightTheme = () =>
  responsiveFontSizes(
    createMuiTheme({
      palette: {
        type: "light",
        background: {
          default: "#d3d3d3",
        },
      },
      overrides: {
        MuiButton: {
          root: {
            border: "solid",
            borderWidth: "thin",
          },
        },
      },
    })
  );

const darkTheme = () =>
  responsiveFontSizes(
    createMuiTheme({
      palette: {
        type: "dark",
      },
      overrides: {
        MuiButton: {
          root: {
            border: "solid",
            borderWidth: "thin",
          },
        },
        MuiLink: {
          root: {
            color: "#757de8",
            textDecoration: "none",
          },
        },
      },
    })
  );

export { lightTheme, darkTheme };
