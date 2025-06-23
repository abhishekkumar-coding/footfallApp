import * as React from "react";
import Svg, { Polyline, Line, Path } from "react-native-svg";
const LogOutIcon = (props) => (
  <Svg
    fill="#fff"
    width="30px"
    height="30px"
    viewBox="0 0 24 24"
    id="sign-out-left-2"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color"
    {...props}
  >
    <Polyline
      id="secondary"
      points="6 15 3 12 6 9"
      style={{
        fill: "none",
        stroke: "#FF0400",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <Line
      id="secondary-2"
      data-name="secondary"
      x1={3}
      y1={12}
      x2={17}
      y2={12}
      style={{
        fill: "none",
        stroke: "#FF0400",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary"
      d="M10,8V5a1,1,0,0,1,1-1h9a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H11a1,1,0,0,1-1-1V16"
      style={{
        fill: "none",
        stroke: "#FF0400",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
  </Svg>
);
export default LogOutIcon;
