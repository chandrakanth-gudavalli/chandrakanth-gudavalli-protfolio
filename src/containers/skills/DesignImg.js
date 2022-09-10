import React, { Component } from "react";

export default class DesignImg extends Component {
  render() {
    const theme = this.props.theme;
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={require("../../assests/images/satellite_image_analysis.png")}
          alt="ckFaces"
          style={{
            textAlign: "right",
            paddingRight: "5px",
            width: "100%",
            maxWidth: "640px",
            marginTop: "20px",
            marginBottom: "10px",
          }}
          // style="width:100%; max-width:512px; margin-top: 20px; margin-bottom: 10px;"
        />
      </div>
    );
  }
}
