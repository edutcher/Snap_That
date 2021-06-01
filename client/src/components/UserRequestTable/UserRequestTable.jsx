import React from "react";
import { useHistory } from "react-router-dom";
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

export default function UserRequestTable(props) {
  const classes = useStyles();
  const history = useHistory();
  const { requests } = props;

  const handleClick = (e) => {
    const id = e.currentTarget.getAttribute("data-id");
    history.push(`/photo/${id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Request</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests &&
            requests.map((row) => (
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">
                  {row.text}
                </TableCell>
                <TableCell align="right">
                  {row.photo ? (
                    <Button data-id={row.photo._id} onClick={handleClick}>
                      {row.status}
                    </Button>
                  ) : (
                    row.status.toUpperCase()
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
