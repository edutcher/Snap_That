import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 250,
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
});

export default function RequestTable(props) {
  const classes = useStyles();
  const { requests, handleFillClick, handleDeleteClick, currentUser } = props;

  return (
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
                  {row.user._id === currentUser.userId ? (
                    <Button
                      id={row._id}
                      data-id={row._id}
                      data-title={row.text}
                      onClick={handleDeleteClick}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Button id={row._id} onClick={handleFillClick}>
                      Fill
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
