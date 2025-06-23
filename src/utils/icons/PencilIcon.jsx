import * as React from "react";
import Svg, { G, Line, Polygon, Polyline } from "react-native-svg";
const PencilIcon = (props) => (
  <Svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="25px"
    height="25px"
    viewBox="0 0 64 64"
    enableBackground="new 0 0 64 64"
    xmlSpace="preserve"
    {...props}
  >
    <G>
      <Line
        fill="none"
        stroke="#4068F6"
        strokeWidth={2}
        strokeMiterlimit={10}
        x1={20}
        y1={54}
        x2={10}
        y2={44}
      />
    </G>
    <Polygon
      fill="none"
      stroke="#4068F6"
      strokeWidth={2}
      strokeMiterlimit={10}
      points="10,44 1,62 2,63 20,54 63,11 53,1 "
    />
    <Line
      fill="none"
      stroke="#4068F6"
      strokeWidth={2}
      strokeMiterlimit={10}
      x1={54}
      y1={20}
      x2={44}
      y2={10}
    />
    <Line
      fill="none"
      stroke="#4068F6"
      strokeWidth={2}
      strokeMiterlimit={10}
      x1={58}
      y1={16}
      x2={48}
      y2={6}
    />
    <Polyline
      fill="none"
      stroke="#4068F6"
      strokeWidth={2}
      strokeMiterlimit={10}
      points="5,54 9,55 10,59 "
    />
  </Svg>
);
export default PencilIcon;
