import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import UploadStepper from "../components/UploadStepper/UploadStepper";
import useQuery from "../hooks/useQuery.js";
import { getRequestById } from "../utils/API.js";

export default function NewPhotoPage() {
  let query = useQuery();
  const requestId = query.get("request");
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
      {request ? <h2> Request: {request.text} </h2> : <h2>New Photo</h2>}
      <UploadStepper request={request} />
    </Container>
  );
}
