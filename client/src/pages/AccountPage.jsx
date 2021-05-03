import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";

export default function AccountPage() {
  const { currentUser } = useContext(UserContext);
  const history = useHistory();

  return (
    <div>
      <h1>Hello {currentUser.username} !!!!</h1>
      <Button onClick={() => history.push("/newphoto")}>Add Photo</Button>
    </div>
  );
}
