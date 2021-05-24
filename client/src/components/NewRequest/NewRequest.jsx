import React from "react";
import { Grid, Button, TextField } from "@material-ui/core";

export default function NewRequest(props) {
  const {
    handleSubmit,
    handleRequestChange,
    newRequest,
    requestMessage,
    requestError,
  } = props;

  return (
    <Grid container>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <Grid item>
            <TextField
              variant="outlined"
              margin="normal"
              required
              error={requestError}
              id="request"
              label="request"
              name="request"
              helperText={requestMessage}
              value={newRequest}
              onChange={handleRequestChange}
              autoFocus
            />
          </Grid>
          <Grid item>
            <Button type="submit">Submit</Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
