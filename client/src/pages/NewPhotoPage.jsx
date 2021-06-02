import React, { useEffect, useState } from "react";
import { Container, Typography, Box, makeStyles } from "@material-ui/core";
import UploadStepper from "../components/UploadStepper/UploadStepper";
import useQuery from "../hooks/useQuery.js";
import { getRequestById } from "../utils/API.js";

const useStyles = makeStyles((theme) => ({
  heading: {
    marginTop: theme.spacing(3),
  },
}));

export default function NewPhotoPage() {
  const classes = useStyles();
  let query = useQuery();
  const requestId = query.get("request");
  const avatar = query.get("avatar");
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const getRequestData = async () => {
      const result = await getRequestById(requestId);
      setRequest(result.data);
    };
    if (requestId) getRequestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Box className={classes.heading}>
        {request ? (
          <Typography variant="h4" component="h4">
            Request: {request.text}
          </Typography>
        ) : avatar ? (
          <Typography variant="h4" component="h4">
            Upload Avatar
          </Typography>
        ) : (
          <Typography variant="h4" component="h4">
            New Photo
          </Typography>
        )}
      </Box>
      <UploadStepper request={request} avatar={avatar} />
    </Container>
  );
}
