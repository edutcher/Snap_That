import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Grid,
  CircularProgress,
} from "@material-ui/core";
import UploadArea from "../UploadArea/UploadArea";
import ConfirmArea from "../ConfirmArea/ConfirmArea";
import CropArea from "../CropArea/CropArea";
import { useHistory } from "react-router-dom";
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
  const [previewSource, setPreviewSource] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [final, setFinal] = useState(null);
  const [dimensions, setDimensions] = useState({});
  const { currentUser } = useContext(UserContext);
  const { request } = props;
  const history = useHistory();

  useEffect(() => {
    return () => {
      setPreviewSource(null);
      setCroppedImage(null);
      setPhotoBlob(null);
    };
  }, []);

  const handleFileInput = async (file) => {
    if (file.length > 1) {
      return;
    }
    previewFile(file[0]);
  };

  const previewFile = (file) => {
    setPhotoBlob(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmit = async () => {
    const reqId = request ? request._id : null;
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
    if (request) {
      const filledRequest = {
        id: reqId,
        photo: result.data._id,
        userId: currentUser.userId,
      };
      await fillRequest(filledRequest);
    }
    setFinal(result.data);
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
            setPhotoBlob={setPhotoBlob}
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
            photoBlob={photoBlob}
          />
        );
      default:
        return "Unknown step";
    }
  }

  const dataURItoBlob = (dataURI) => {
    var byteString = atob(dataURI.split(",")[1]);

    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    var ab = new ArrayBuffer(byteString.length);

    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    var blob = new Blob([ab], { type: mimeString });
    return blob;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (title && category && activeStep === 2) {
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

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
    setPhotoBlob(dataURItoBlob(previewSource));
  };

  const handleReset = () => {
    setPreviewSource(null);
    setPhotoBlob(null);
    setActiveStep(0);
  };

  const handlePhotoClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    history.push(`/photo/${id}`);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption" component="div">
                Optional
              </Typography>
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
          <Grid container justify={"center"}>
            {final ? (
              <Grid item xs={12}>
                <Typography className={classes.instructions} component="div">
                  All steps completed - you&apos;re finished
                </Typography>
                <img
                  data-id={final._id}
                  src={final.image_url}
                  alt={final.title}
                  style={{ height: "400px", cursor: "pointer" }}
                  onClick={handlePhotoClick}
                />
              </Grid>
            ) : (
              <CircularProgress />
            )}

            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </Grid>
        ) : (
          <div>
            <Typography className={classes.instructions} component="div">
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
                disabled={previewSource === null}
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
