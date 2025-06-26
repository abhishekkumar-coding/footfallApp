import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { wp } from "../dimensions";
const UserIcon = (props) => (
  <Svg
    width={wp(5.5)}
    height={wp(5.5)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6 8a6 6 0 1 1 12 0A6 6 0 0 1 6 8zm2 10a3 3 0 0 0-3 3 1 1 0 1 1-2 0 5 5 0 0 1 5-5h8a5 5 0 0 1 5 5 1 1 0 1 1-2 0 3 3 0 0 0-3-3H8z"
      fill="#d3d3d3"
    />
  </Svg>
);
export default UserIcon;
