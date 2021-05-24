import React, { useState, useContext } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { UserContext } from "../contexts/UserContext.js";
import { Button, TextField } from "@material-ui/core";
import { postRequest } from "../utils/API.js";

export default function NewRequestPage() {
  const [request, setRequest] = useState("");
  const { currentUser } = useContext(UserContext);

  const handleInputChange = (e) => {
    setRequest(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      user: currentUser.userId,
      text: request,
    };
    postRequest(newRequest);
  };

  return (
    <Container>
      <h1>Add a Request</h1>
      <Grid container>
        <Grid item>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="request"
              label="request"
              name="request"
              value={request}
              onChange={handleInputChange}
              autoFocus
            />
            <Button type="submit">Submit</Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}
