import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
import { hp, wp } from "../dimensions";
/* SVGR has dropped some elements not supported by react-native-svg: title */
const ProfileEditIcon = (props) => (
  <Svg
    fill="#fff"
    width={wp(6)}
    height={hp(3)}
    viewBox="0 0 36 36"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Path
      className="clr-i-outline clr-i-outline-path-1"
      d="M33.87,8.32,28,2.42a2.07,2.07,0,0,0-2.92,0L4.27,23.2l-1.9,8.2a2.06,2.06,0,0,0,2,2.5,2.14,2.14,0,0,0,.43,0L13.09,32,33.87,11.24A2.07,2.07,0,0,0,33.87,8.32ZM12.09,30.2,4.32,31.83l1.77-7.62L21.66,8.7l6,6ZM29,13.25l-6-6,3.48-3.46,5.9,6Z"
    />
    <Rect x={0} y={0} width={36} height={36} fillOpacity={0} />
  </Svg>
);
export default ProfileEditIcon;
