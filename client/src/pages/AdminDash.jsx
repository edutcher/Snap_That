import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../contexts/UserContext.js";
import { useHistory } from "react-router-dom";
import {
  getPendingRequests,
  denyRequest,
  approveRequest,
} from "../utils/API.js";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
});

export default function AdminDash() {
  const [pendingRequests, setPendingRequests] = useState(null);
  const classes = useStyles();
  const { currentUser } = useContext(UserContext);
  const history = useHistory();

  const getPending = async () => {
    const results = await getPendingRequests();
    setPendingRequests(results.data);
  };

  useEffect(() => {
    if (currentUser.isAdmin) getPending();
    else history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleApproveClick = async (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    const req = {
      id,
    };
    await approveRequest(req);
    setPendingRequests(pendingRequests.filter((req) => req._id !== id));
  };

  const handleDenyClick = async (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    const req = {
      id,
    };
    await denyRequest(req);
    setPendingRequests(pendingRequests.filter((req) => req._id !== id));
  };

  return (
    <Container>
      <h1>Admin Dash</h1>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Request</TableCell>
              <TableCell align="right">User</TableCell>
              <TableCell align="right">Approve</TableCell>
              <TableCell align="right">Deny</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingRequests &&
              pendingRequests.map((row) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {row.text}
                  </TableCell>
                  <TableCell align="right">{row.user.username}</TableCell>
                  <TableCell align="right">
                    {" "}
                    <Button data-id={row._id} onClick={handleApproveClick}>
                      Approve
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    {" "}
                    <Button data-id={row._id} onClick={handleDenyClick}>
                      Deny
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
