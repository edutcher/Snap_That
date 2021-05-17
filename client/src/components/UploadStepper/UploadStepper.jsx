import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import UploadArea from "../UploadArea/UploadArea";
import ConfirmArea from "../ConfirmArea/ConfirmArea";
import CropArea from "../CropArea/CropArea";
import { UserContext } from "../../contexts/UserContext.js";
import { uploadPhoto, fillRequest } from "../../utils/API.js";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: "15px",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Choose File", "Edit Image", "Upload"];
}

export default function UploadStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [category, setCategory] = useState("");
  const [skipped, setSkipped] = useState(new Set());
  const [title, setTitle] = useState("");
  const steps = getSteps();
  const [previewSource, setPreviewSource] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [dimensions, setDimensions] = useState({});
  const { currentUser } = useContext(UserContext);
  const { request } = props;

  const handleFileInput = async (file) => {
    if (file.length > 1) {
      return;
    }
    previewFile(file[0]);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmit = async () => {
    const reqId = request._id || null;
    const photo = {
      details: {
        title,
        category,
        tags,
        dimensions,
        request: reqId,
        user: currentUser.userId,
      },
      photo: croppedImage,
    };
    let result = await uploadPhoto(photo);
    console.log(result);
    if (request) {
      const filledRequest = {
        id: reqId,
        photo: result.data._id,
        userId: currentUser.userId,
      };
      await fillRequest(filledRequest);
    }
    console.log(result);
  };

  const isStepOptional = (step) => {
    return step === 1;
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <UploadArea
            handleFileInput={handleFileInput}
            previewSource={previewSource}
          />
        );
      case 1:
        return (
          <CropArea
            previewSource={previewSource}
            setCroppedImage={setCroppedImage}
          />
        );
      case 2:
        return (
          <ConfirmArea
            handleSubmit={handleSubmit}
            croppedImage={croppedImage}
            setCategory={setCategory}
            category={category}
            title={title}
            setTitle={setTitle}
            tags={tags}
            setTags={setTags}
            newTag={newTag}
            setNewTag={setNewTag}
            setDimensions={setDimensions}
          />
        );
      default:
        return "Unknown step";
    }
  }

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === 2) {
      handleSubmit();
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setCroppedImage(previewSource);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
