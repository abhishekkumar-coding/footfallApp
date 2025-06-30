import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { wp } from "../dimensions";

const FilledFavIcon = (props) => {
  return (
    <Svg
      width={wp(5)}
      height={wp(5)}
      viewBox="0 0 24 24"
      id="favourite"
      xmlns="http://www.w3.org/2000/svg"
      {...props} // this allows you to pass styles or overrides from parent
    >
      <Path
        d="M19.57,5.44a4.91,4.91,0,0,1,0,6.93L12,20,4.43,12.37A4.91,4.91,0,0,1,7.87,4a4.9,4.9,0,0,1,3.44,1.44,4.46,4.46,0,0,1,.69.88,4.46,4.46,0,0,1,.69-.88,4.83,4.83,0,0,1,6.88,0Z"
        fill="#FF0000"
      />
    </Svg>
  );
};

export default FilledFavIcon;
