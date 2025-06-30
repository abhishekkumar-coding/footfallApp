import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { wp } from "../dimensions";
const EmptyHome = (props) => (
  <Svg
    width={wp(6)}
    height={wp(6)}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="#fff"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.36 1.37l6.36 5.8-.71.71L13 6.964v6.526l-.5.5h-3l-.5-.5v-3.5H7v3.5l-.5.5h-3l-.5-.5V6.972L2 7.88l-.71-.71 6.35-5.8h.72zM4 6.063v6.927h2v-3.5l.5-.5h3l.5.5v3.5h2V6.057L8 2.43 4 6.063z"
    />
  </Svg>
);
export default EmptyHome;

