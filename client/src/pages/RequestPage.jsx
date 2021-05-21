import React, { useState, useEffect, useContext } from "react";
import { getRequests } from "../utils/API.js";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container } from "@material-ui/core";
import { UserContext } from "../contexts/UserContext.js";
import { useHistory } from "react-router-dom";
import RequestTable from "../components/RequestTable/RequestTable";

const useStyles = makeStyles({
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
});

export default function RequestPage() {
  const classes = useStyles();
  const [requests, setRequests] = useState([]);
  const { currentUser } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    const getData = async () => {
      let result = await getRequests();
      setRequests(result.data);
    };
    getData();
  }, []);

  const handleFillClick = (e) => {
    if (currentUser.username)
      history.push(`/newphoto?request=${e.currentTarget.id}`);
    else history.push("/login");
  };

  return (
    <Container>
      <h1 className={classes.header}>Requests</h1>
      {currentUser.username && (
        <Button component="a" href="/newrequest">
          Add Request
        </Button>
      )}
      {requests && (
        <RequestTable requests={requests} handleFillClick={handleFillClick} />
      )}
    </Container>
  );
}
