import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { wp } from "../dimensions";
const EyeIcon = (props) => (
  <Svg
    width={wp(5.5)}
    height={wp(5.5)}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="#d3d3d3"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 10c0-3.9 3.1-7 7-7s7 3.1 7 7h-1c0-3.3-2.7-6-6-6s-6 2.7-6 6H1zm4 0c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3zm1 0c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"
    />
  </Svg>
);
export default EyeIcon;
