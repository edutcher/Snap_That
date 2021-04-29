import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";
import PhotoCard from "../components/PhotoCard/PhotoCard";
import axios from "axios";

class HomePage extends Component {
  state = {
    images: [],
  };

  componentDidMount() {
    axios
      .get("/api/photos")
      .then((res) => {
        console.log(res);
        this.setState({ images: res.data });
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <Container>
        <div>
          <h1 style={{ alignText: "center" }}>
            Snap-That <CameraEnhanceIcon />
          </h1>
        </div>
        <Grid container>
          {this.state.images.map((image) => (
            <PhotoCard image={image} />
          ))}
        </Grid>
      </Container>
    );
  }
}

export default HomePage;
