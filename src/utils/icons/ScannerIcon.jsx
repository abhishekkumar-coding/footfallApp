import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { hp, wp } from "../dimensions";
const ScannerIcon = (props) => (
  <Svg
    fill="#fff"
    width={wp(6)}
        height={hp(3)}
    viewBox="0 0 24 24"
    id="qr-code-scan-2"
    data-name="Flat Line"
    xmlns="http://www.w3.org/2000/svg"
    className="icon flat-line"
    {...props}
  >
    <Path
      id="secondary"
      d="M11,11H7V7h4Zm2,6h4V13H13Z"
      style={{
        fill: "rgb(44, 169, 188)",
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary"
      d="M11,11H7V7h4Zm6-4H15V9h2ZM13,17h4V13H13ZM7,17H9V15H7Z"
      style={{
        fill: "none",
        stroke: "#fff",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary-2"
      data-name="primary"
      d="M8,3H4A1,1,0,0,0,3,4V8"
      style={{
        fill: "none",
        stroke: "#fff",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary-3"
      data-name="primary"
      d="M21,8V4a1,1,0,0,0-1-1H16"
      style={{
        fill: "none",
        stroke: "#fff",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary-4"
      data-name="primary"
      d="M3,16v4a1,1,0,0,0,1,1H8"
      style={{
        fill: "none",
        stroke: "#fff",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary-5"
      data-name="primary"
      d="M16,21h4a1,1,0,0,0,1-1V16"
      style={{
        fill: "none",
        stroke: "#fff",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
  </Svg>
);
export default ScannerIcon;
