import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import * as ml5 from "ml5";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function ConfirmArea(props) {
  const classes = useStyles();
  const croppedPreview = props.croppedImage;
  const [predictions, setPredictions] = useState([]);

  const handleCategoryChange = (e) => {
    props.setCategory(e.target.value);
  };

  const classifyImg = () => {
    // Initialize the Image Classifier method with MobileNet
    const classifier = ml5.imageClassifier("MobileNet", modelLoaded);
    // When the model is loaded
    function modelLoaded() {
      console.log("Model Loaded!");

      const image = document.getElementById("image");
      // Make a prediction with a selected image
      classifier.predict(image, 5, function (err, results) {
        // print the result in the console
        console.log(results);
        setPredictions(results);
      });
    }
  };

  useEffect(() => {
    classifyImg();
  }, []);

  const handleDelete = (chipToDelete) => () => {
    setPredictions((chips) =>
      chips.filter((chip) => chip.label !== chipToDelete.label)
    );
  };

  const handleTitleChange = (e) => {
    props.setTitle(e.target.value);
  };

  return (
    <div className={classes.root}>
      {props.croppedImage && (
        <div>
          <img
            id="image"
            src={croppedPreview}
            alt="chosen"
            style={{ height: "300px" }}
          />
        </div>
      )}
      <Grid container>
        <Grid item xs={12} sm={6}>
          <TextField
            id="title"
            name="title"
            label="Title"
            onChange={handleTitleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl required className={classes.formControl}>
            <InputLabel id="demo-simple-select-required-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              id="demo-simple-select-required"
              value={props.category}
              onChange={handleCategoryChange}
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"Places"}>Places</MenuItem>
              <MenuItem value={"People"}>People</MenuItem>
              <MenuItem value={"Animals"}>Animals</MenuItem>
              <MenuItem value={"Items"}>Items</MenuItem>
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField id="tags" name="tags" label="Tags" />
        </Grid>
      </Grid>
      <Paper component="ul" className={classes.root}>
        {predictions.map((data) => {
          return (
            <li key={data.label}>
              <Chip
                label={data.label}
                onDelete={handleDelete(data)}
                className={classes.chip}
              />
            </li>
          );
        })}
      </Paper>
    </div>
  );
}
