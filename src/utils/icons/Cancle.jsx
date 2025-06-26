import * as React from "react";
import Svg, { Circle, Line } from "react-native-svg";
const Cancle = (props) => (
  <Svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 32 32"
    enableBackground="new 0 0 32 32"
    xmlSpace="preserve"
    {...props}
  >
    <Circle
      fill="none"
      stroke="#000000"
      strokeWidth={2}
      strokeMiterlimit={10}
      cx={16}
      cy={16}
      r={12}
    />
    <Line
      fill="none"
      stroke="#000000"
      strokeWidth={2}
      strokeMiterlimit={10}
      x1={11.5}
      y1={11.5}
      x2={20.5}
      y2={20.5}
    />
    <Line
      fill="none"
      stroke="#000000"
      strokeWidth={2}
      strokeMiterlimit={10}
      x1={20.5}
      y1={11.5}
      x2={11.5}
      y2={20.5}
    />
  </Svg>
);
export default Cancle;
