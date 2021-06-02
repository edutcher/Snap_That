import React, { useState, useEffect, useContext } from "react";
import { getRequests } from "../utils/API.js";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Typography } from "@material-ui/core";
import { UserContext } from "../contexts/UserContext.js";
import { useHistory } from "react-router-dom";
import RequestTable from "../components/RequestTable/RequestTable";
import NewRequest from "../components/NewRequest/NewRequest.jsx";
import ConfirmModal from "../components/ConfirmModal/ConfirmModal";
import { postRequest, deleteRequest } from "../utils/API.js";

const useStyles = makeStyles({
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
});

export default function RequestPage() {
  const classes = useStyles();
  const [requests, setRequests] = useState(null);
  const [newRequest, setNewRequest] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [chosenReq, setChosenReq] = useState(null);
  const { currentUser } = useContext(UserContext);
  const history = useHistory();

  const validateInput = () => {
    const req = newRequest.toLowerCase();
    if (req.includes("swear words")) {
      setRequestMessage("No Swear Words");
      setRequestError(true);
    } else if (req.includes("celebrities")) {
      setRequestMessage("Leave Brittney Alone");
      setRequestError(true);
    } else {
      setRequestMessage("");
      setRequestError(false);
    }
  };

  const handleRequestChange = async (e) => {
    setNewRequest(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPostRequest = {
      user: currentUser.userId,
      text: newRequest,
    };
    const result = await postRequest(newPostRequest);

    if (result.status === 200) {
      setNewRequest("");
      setRequestMessage(
        "Thank you for your request, you will be notified when it is reviewed"
      );
    } else {
      setRequestMessage("Something went wrong, try again");
      setRequestError(true);
    }
  };

  useEffect(() => {
    const getData = async () => {
      let result = await getRequests();
      setRequests(result.data);
    };
    if (requests === null) getData();
    validateInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRequest]);

  const handleFillClick = (e) => {
    if (currentUser.username)
      history.push(`/newphoto?request=${e.currentTarget.id}`);
    else history.push("/login");
  };

  const handleDeleteClick = (e) => {
    const title = e.currentTarget.getAttribute("data-title");
    const id = e.currentTarget.getAttribute("data-id");
    setChosenReq({ title, id });
    setTimeout(() => {
      setConfirmOpen(true);
    }, 100);
  };

  const handleDelete = () => {
    deleteRequest(chosenReq.id);
    setRequests(requests.filter((req) => req._id !== chosenReq.id));
    setConfirmOpen(false);
  };

  return (
    <Container>
      <Grid container>
        <Grid item>
          <Typography variant="h1" component="h1" className={classes.header}>
            Requests
          </Typography>
        </Grid>
        {currentUser.username && (
          <NewRequest
            handleSubmit={handleSubmit}
            newRequest={newRequest}
            handleRequestChange={handleRequestChange}
            requestMessage={requestMessage}
            requestError={requestError}
          />
        )}
        {requests && (
          <RequestTable
            currentUser={currentUser}
            requests={requests}
            handleFillClick={handleFillClick}
            handleDeleteClick={handleDeleteClick}
          />
        )}
        {chosenReq && (
          <ConfirmModal
            confirmOpen={confirmOpen}
            setConfirmOpen={setConfirmOpen}
            title={chosenReq.title}
            id={chosenReq.id}
            handleDelete={handleDelete}
          />
        )}
      </Grid>
    </Container>
  );
}
