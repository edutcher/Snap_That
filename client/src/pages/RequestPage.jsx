import React, { useState, useEffect, useContext } from "react";
import Container from "@material-ui/core/Container";
import { getRequests } from "../utils/API.js";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";
import { UserContext } from "../contexts/UserContext.js";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
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
    history.push(`/newphoto?request=${e.currentTarget.id}`);
  };

  return (
    <Container>
      <h1 className={classes.header}>Requests</h1>
      {currentUser.username && (
        <Button component="a" href="/newrequest">
          Add Request
        </Button>
      )}
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Request</TableCell>
              <TableCell align="right">User</TableCell>
              <TableCell align="right">Fill</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests &&
              requests.map((row) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {row.text}
                  </TableCell>
                  <TableCell align="right">{row.user.username}</TableCell>
                  <TableCell align="right">
                    {" "}
                    <Button id={row._id} onClick={handleFillClick}>
                      Fill
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
