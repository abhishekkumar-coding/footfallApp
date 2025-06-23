import * as React from "react";
import Svg, { Polygon } from "react-native-svg";
const LeftArrowIcon = (props) => (
  <Svg
    width="25"
    height="25"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 48 48"
    {...props}
  >
    <Polygon
      fill="#d3d3d3"
      points="30.9,43 34,39.9 18.1,24 34,8.1 30.9,5 12,24"
    />
  </Svg>
);
export default LeftArrowIcon;
