import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { wp } from "../dimensions";
const FilledGame = (props) => (
  <Svg
    width={wp(5)}
    height={wp(5)}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 5.5C0 3.567 1.567 2 3.5 2H11.5C13.433 2 15 3.567 15 5.5V10.0279C15 11.6693 13.6693 13 12.0279 13C10.9021 13 9.87296 12.364 9.3695 11.357L9.19098 11H5.80902L5.6305 11.357C5.12704 12.364 4.0979 13 2.97214 13C1.33067 13 0 11.6693 0 10.0279V5.5ZM4 8V7H3V6H4V5H5V6H6V7H5V8H4ZM10 8H9V7H10V8ZM11 6H12V5H11V6Z"
      fill="#fff"
    />
  </Svg>
);
export default FilledGame;
