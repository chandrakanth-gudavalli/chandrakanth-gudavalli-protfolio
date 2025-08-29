import React, { Component } from "react";

export default class sfm_image extends Component {
  render() {
    const theme = this.props.theme;
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={require("../../assests/images/output4.png")}
          alt="ckFaces"
          style={{
            textAlign: "right",
            paddingRight: "5px",
            width: "70%",
            maxWidth: "640px",
            marginTop: "2px",
            marginBottom: "2px",
          }}
          // style="width:100%; max-width:512px; margin-top: 20px; margin-bottom: 10px;"
        />
      </div>
    );
  }
}
