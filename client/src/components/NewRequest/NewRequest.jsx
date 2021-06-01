import React from "react";
import { Grid, Button, TextField, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  submitBtn: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
}));

export default function NewRequest(props) {
  const classes = useStyles();
  const {
    handleSubmit,
    handleRequestChange,
    newRequest,
    requestMessage,
    requestError,
  } = props;

  return (
    <Grid container>
      <Grid item xs={12}>
        <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                error={requestError}
                id="request"
                label="New Request"
                name="request"
                helperText={requestMessage}
                value={newRequest}
                onChange={handleRequestChange}
                autoFocus
              />
            </Grid>
            <Grid item>
              <Button type="submit" className={classes.submitBtn}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
