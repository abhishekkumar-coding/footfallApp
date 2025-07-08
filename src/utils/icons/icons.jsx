import * as React from "react";
import Svg, {G, Line, Path, Polygon, Polyline } from "react-native-svg";
import { wp } from "../dimensions";
export const CloseEyeIcon = (props) => (
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
      d="M8 2c-1.5 0-2.8.4-3.9 1.2l.8.7C5.8 3.3 6.8 3 8 3c3.3 0 6 2.7 6 6h1c0-3.9-3.1-7-7-7zM1 3l1.6 1.5C1.6 5.7 1 7.3 1 9h1c0-1.5.5-2.8 1.4-3.8l2.2 2C5.2 7.7 5 8.3 5 9c0 1.7 1.3 3 3 3 .8 0 1.5-.3 2-.8l3 2.8.7-.7-12-11L1 3zm5.3 4.9l2.9 2.7c-.3.2-.7.4-1.2.4-1.1 0-2-.9-2-2 0-.4.1-.8.3-1.1zM11 9.5l-1-.9c-.2-.8-.9-1.5-1.8-1.6l-1-.9c.3-.1.5-.1.8-.1 1.7 0 3 1.3 3 3v.5z"
    />
  </Svg>
);

export const EmailIcon = (props) => (
  <Svg
    width={wp(5.5)}
    height={wp(5.5)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G id="style=stroke">
      <G id="email">
        <Path
          id="vector (Stroke)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.88534 5.2371C3.20538 5.86848 2.75 6.89295 2.75 8.5V15.5C2.75 17.107 3.20538 18.1315 3.88534 18.7629C4.57535 19.4036 5.61497 19.75 7 19.75H17C18.385 19.75 19.4246 19.4036 20.1147 18.7629C20.7946 18.1315 21.25 17.107 21.25 15.5V8.5C21.25 6.89295 20.7946 5.86848 20.1147 5.2371C19.4246 4.59637 18.385 4.25 17 4.25H7C5.61497 4.25 4.57535 4.59637 3.88534 5.2371ZM2.86466 4.1379C3.92465 3.15363 5.38503 2.75 7 2.75H17C18.615 2.75 20.0754 3.15363 21.1353 4.1379C22.2054 5.13152 22.75 6.60705 22.75 8.5V15.5C22.75 17.393 22.2054 18.8685 21.1353 19.8621C20.0754 20.8464 18.615 21.25 17 21.25H7C5.38503 21.25 3.92465 20.8464 2.86466 19.8621C1.79462 18.8685 1.25 17.393 1.25 15.5V8.5C1.25 6.60705 1.79462 5.13152 2.86466 4.1379Z"
          fill="#d3d3d3"
        />
        <Path
          id="vector (Stroke)_2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.3633 7.31026C19.6166 7.63802 19.5562 8.10904 19.2285 8.3623L13.6814 12.6486C12.691 13.4138 11.3089 13.4138 10.3185 12.6486L4.77144 8.3623C4.44367 8.10904 4.38328 7.63802 4.63655 7.31026C4.88982 6.98249 5.36083 6.9221 5.6886 7.17537L11.2356 11.4616C11.6858 11.8095 12.3141 11.8095 12.7642 11.4616L18.3113 7.17537C18.6391 6.9221 19.1101 6.98249 19.3633 7.31026Z"
          fill="#d3d3d3"
        />
      </G>
    </G>
  </Svg>
);

export const EmptyGame = (props) => (
  <Svg
    width={wp(5)}
    height={wp(5)}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M9.81672 11.1334L9.3695 11.357L9.3695 11.357L9.81672 11.1334ZM9.5 10.5L9.94721 10.2764C9.86252 10.107 9.68939 10 9.5 10V10.5ZM5.5 10.5V10C5.31061 10 5.13748 10.107 5.05279 10.2764L5.5 10.5ZM14 5.5V10.0279H15V5.5H14ZM10.2639 10.9098L9.94721 10.2764L9.05279 10.7236L9.3695 11.357L10.2639 10.9098ZM9.5 10H5.5V11H9.5V10ZM5.05279 10.2764L4.73607 10.9098L5.6305 11.357L5.94721 10.7236L5.05279 10.2764ZM1 10.0279V5.5H0V10.0279H1ZM3.5 3H11.5V2H3.5V3ZM2.97214 12C1.88296 12 1 11.117 1 10.0279H0C0 11.6693 1.33067 13 2.97214 13V12ZM12.0279 12C11.2809 12 10.598 11.578 10.2639 10.9098L9.3695 11.357C9.87296 12.364 10.9021 13 12.0279 13V12ZM14 10.0279C14 11.117 13.117 12 12.0279 12V13C13.6693 13 15 11.6693 15 10.0279H14ZM4.73607 10.9098C4.402 11.578 3.71913 12 2.97214 12V13C4.0979 13 5.12704 12.364 5.6305 11.357L4.73607 10.9098ZM15 5.5C15 3.567 13.433 2 11.5 2V3C12.8807 3 14 4.11929 14 5.5H15ZM1 5.5C1 4.11929 2.11929 3 3.5 3V2C1.567 2 0 3.567 0 5.5H1ZM3 7H6V6H3V7ZM4 5V8H5V5H4ZM11 6H12V5H11V6ZM9 8H10V7H9V8Z"
      fill="#fff"
    />
  </Svg>
);

export const EmptyHeart = (props) => (
  <Svg
    fill="#fff"
    width={wp(6)}
    height={wp(6)}
    viewBox="0 0 24 24"
    id="favourite"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color"
    {...props}
  >
    <Path
      id="primary"
      d="M19.57,5.44a4.91,4.91,0,0,1,0,6.93L12,20,4.43,12.37A4.91,4.91,0,0,1,7.87,4a4.9,4.9,0,0,1,3.44,1.44,4.46,4.46,0,0,1,.69.88,4.46,4.46,0,0,1,.69-.88,4.83,4.83,0,0,1,6.88,0Z"
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

export const EmptyHome = (props) => (
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

export const EmptyProfile = (props) => (
  <Svg
    width={wp(6)}
    height={wp(6)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G id="style=linear">
      <G id="profile">
        <Path
          id="vector"
          d="M12 11C14.4853 11 16.5 8.98528 16.5 6.5C16.5 4.01472 14.4853 2 12 2C9.51472 2 7.5 4.01472 7.5 6.5C7.5 8.98528 9.51472 11 12 11Z"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          id="rec"
          d="M5 18.5714C5 16.0467 7.0467 14 9.57143 14H14.4286C16.9533 14 19 16.0467 19 18.5714C19 20.465 17.465 22 15.5714 22H8.42857C6.53502 22 5 20.465 5 18.5714Z"
          stroke="#fff"
          strokeWidth={1.5}
        />
      </G>
    </G>
  </Svg>
);

export const EyeIcon = (props) => (
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

export const FavIcon = (props) => (
    <Svg
        fill="#bbb"
        width={wp(5)}
        height={wp(5)}
        viewBox="0 0 24 24"
        id="favourite"
        data-name="Line Color"
        xmlns="http://www.w3.org/2000/svg"
        className="icon line-color"
        {...props}
    >
        <Path
            id="primary"
            d="M19.57,5.44a4.91,4.91,0,0,1,0,6.93L12,20,4.43,12.37A4.91,4.91,0,0,1,7.87,4a4.9,4.9,0,0,1,3.44,1.44,4.46,4.46,0,0,1,.69.88,4.46,4.46,0,0,1,.69-.88,4.83,4.83,0,0,1,6.88,0Z"
            style={{
                fill: "none",
                stroke: "#bbb",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
            }}
        />
    </Svg>
);

export const FilledFavIcon = (props) => {
  return (
    <Svg
      width={wp(6)}
      height={wp(6)}
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

export const FilledGame = (props) => (
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

export const FilledHeart = (props) => (
  <Svg
    width={wp(6)}
    height={wp(6)}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M4.03553 1C1.80677 1 0 2.80677 0 5.03553C0 6.10582 0.42517 7.13228 1.18198 7.88909L7.14645 13.8536C7.34171 14.0488 7.65829 14.0488 7.85355 13.8536L13.818 7.88909C14.5748 7.13228 15 6.10582 15 5.03553C15 2.80677 13.1932 1 10.9645 1C9.89418 1 8.86772 1.42517 8.11091 2.18198L7.5 2.79289L6.88909 2.18198C6.13228 1.42517 5.10582 1 4.03553 1Z"
      fill="#fff"
    />
  </Svg>
);

export const FilledHistoryIcon = (props) => (
  <Svg
    width={wp(5.5)}
    height={wp(5.5)}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fill="#fff"
      d="M10.6972,0.468433 C12.354,1.06178 13.7689,2.18485 14.7228,3.66372 C15.6766,5.14258 16.1163,6.89471 15.9736,8.64872 C15.8309,10.4027 15.1138,12.0607 13.9334,13.366 C12.753,14.6712 11.1752,15.5508 9.4443,15.8685 C7.71342,16.1863 5.92606,15.9244 4.35906,15.1235 C2.79206,14.3226 1.53287,13.0274 0.776508,11.4384 C0.539137,10.9397 0.750962,10.343 1.24963,10.1057 C1.74831,9.86829 2.34499,10.0801 2.58236,10.5788 C3.14963,11.7705 4.09402,12.742 5.26927,13.3426 C6.44452,13.9433 7.78504,14.1397 9.08321,13.9014 C10.3814,13.6631 11.5647,13.0034 12.45,12.0245 C13.3353,11.0456 13.8731,9.80205 13.9801,8.48654 C14.0872,7.17103 13.7574,5.85694 13.042,4.74779 C12.3266,3.63864 11.2655,2.79633 10.0229,2.35133 C8.78032,1.90632 7.42568,1.88344 6.1688,2.28624 C5.34644,2.54978 4.59596,2.98593 3.96459,3.5597 L4.69779,4.29291 C5.32776,4.92287 4.88159,6.00002 3.99069,6.00002 L1.77635684e-15,6.00002 L1.77635684e-15,2.00933 C1.77635684e-15,1.11842 1.07714,0.672258 1.70711,1.30222 L2.54916,2.14428 C3.40537,1.3473 4.43126,0.742882 5.55842,0.381656 C7.23428,-0.155411 9.04046,-0.124911 10.6972,0.468433 Z M8,4 C8.55229,4 9,4.44772 9,5 L9,7.58579 L10.7071,9.29289 C11.0976,9.68342 11.0976,10.3166 10.7071,10.7071 C10.3166,11.0976 9.68342,11.0976 9.29289,10.7071 L7,8.41421 L7,5 C7,4.44772 7.44772,4 8,4 Z"
    />
  </Svg>
);

export const FilledHome = (props) => (
  <Svg
    fill="#fff"
    width={wp(6)}
    height={wp(6)}
    viewBox="0 0 24 24"
    baseProfile="tiny"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path d="M12 3s-6.186 5.34-9.643 8.232c-.203.184-.357.452-.357.768 0 .553.447 1 1 1h2v7c0 .553.447 1 1 1h3c.553 0 1-.448 1-1v-4h4v4c0 .552.447 1 1 1h3c.553 0 1-.447 1-1v-7h2c.553 0 1-.447 1-1 0-.316-.154-.584-.383-.768-3.433-2.892-9.617-8.232-9.617-8.232z" />
  </Svg>
);

export const FilledProfile = (props) => (
  <Svg
    width={wp(6)}
    height={wp(6)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G id="style=fill">
      <G id="profile">
        <Path
          id="vector (Stroke)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.75 6.5C6.75 3.6005 9.1005 1.25 12 1.25C14.8995 1.25 17.25 3.6005 17.25 6.5C17.25 9.3995 14.8995 11.75 12 11.75C9.1005 11.75 6.75 9.3995 6.75 6.5Z"
          fill="#fff"
        />
        <Path
          id="rec (Stroke)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.25 18.5714C4.25 15.6325 6.63249 13.25 9.57143 13.25H14.4286C17.3675 13.25 19.75 15.6325 19.75 18.5714C19.75 20.8792 17.8792 22.75 15.5714 22.75H8.42857C6.12081 22.75 4.25 20.8792 4.25 18.5714Z"
          fill="#fff"
        />
      </G>
    </G>
  </Svg>
);

export const History = (props) => (
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
      d="M13.507 12.324a7 7 0 0 0 .065-8.56A7 7 0 0 0 2 4.393V2H1v3.5l.5.5H5V5H2.811a6.008 6.008 0 1 1-.135 5.77l-.887.462a7 7 0 0 0 11.718 1.092zm-3.361-.97l.708-.707L8 7.792V4H7v4l.146.354 3 3z"
    />
  </Svg>
);

export const KeyIcon = (props) => (
  <Svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="25px"
    height="25px"
    viewBox="0 0 32 32"
    enableBackground="new 0 0 32 32"
    xmlSpace="preserve"
    {...props}
  >
    <G>
      <Path
        fill="#d3d3d3"
        d="M14.683,14.698c0.117,0,0.235-0.041,0.33-0.124L26.33,4.652L25.67,3.9l-11.317,9.921 c-0.208,0.182-0.229,0.498-0.046,0.706C14.406,14.64,14.544,14.698,14.683,14.698z"
      />
      <Path
        fill="#d3d3d3"
        d="M10.188,32C16.33,32,20,27.17,20,22.5c0-1.346-0.322-2.829-0.798-3.792l4.522-2.261 C23.893,16.362,24,16.189,24,16v-4h3c0.011,0,0.102-0.006,0.113-0.006C27.779,11.949,27.978,11.737,28,11V7h3 c0.129,0,0.218,0.014,0.278,0.023c0.121,0.019,0.347,0.054,0.543-0.122c0.202-0.18,0.193-0.408,0.185-0.609 C32.004,6.22,32,6.125,32,6V1.469C32,0.659,31.341,0,30.531,0h-3.875c-0.354,0-0.698,0.129-0.969,0.364l-13.187,11.56 c-0.649-0.13-1.63-0.299-2.313-0.299C4.57,11.625,0,16.195,0,21.812S4.57,32,10.188,32z M10.188,12.625 c0.501,0,1.359,0.12,2.354,0.328c0.155,0.034,0.314-0.01,0.432-0.113L26.345,1.118C26.432,1.042,26.543,1,26.656,1h3.875 C30.79,1,31,1.21,31,1.469V6h-3.5C27.224,6,27,6.224,27,6.5V11h-3.5c-0.276,0-0.5,0.224-0.5,0.5v4.191l-4.724,2.362 c-0.131,0.065-0.227,0.186-0.262,0.328c-0.035,0.142-0.006,0.293,0.08,0.412C18.534,19.4,19,20.907,19,22.5 c0,4.178-3.296,8.5-8.812,8.5C5.122,31,1,26.878,1,21.812S5.122,12.625,10.188,12.625z"
      />
      <Path
        fill="#d3d3d3"
        d="M8.5,27c1.93,0,3.5-1.57,3.5-3.5S10.43,20,8.5,20S5,21.57,5,23.5S6.57,27,8.5,27z M8.5,21 c1.378,0,2.5,1.122,2.5,2.5S9.878,26,8.5,26S6,24.878,6,23.5S7.122,21,8.5,21z"
      />
    </G>
  </Svg>
);

export const LeftArrowIcon = (props) => (
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

export const SVGComponent = (props) => (
  <Svg
    width={wp(5.5)}
    height={wp(5.5)}
    viewBox="0 0 1024 1024"
    className="icon"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      fill="#d3d3d3"
      d="M224 448a32 32 0 00-32 32v384a32 32 0 0032 32h576a32 32 0 0032-32V480a32 32 0 00-32-32H224zm0-64h576a96 96 0 0196 96v384a96 96 0 01-96 96H224a96 96 0 01-96-96V480a96 96 0 0196-96z"
    />
    <Path
      fill="#d3d3d3"
      d="M512 544a32 32 0 0132 32v192a32 32 0 11-64 0V576a32 32 0 0132-32zM704 384v-64a192 192 0 10-384 0v64h384zM512 64a256 256 0 01256 256v128H256V320A256 256 0 01512 64z"
    />
  </Svg>
);

export const LogOutIcon = (props) => (
  <Svg
    fill="#fff"
    width={wp(6)}
        height={hp(3)}
    viewBox="0 0 24 24"
    id="sign-out-left-2"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color"
    {...props}
  >
    <Polyline
      id="secondary"
      points="6 15 3 12 6 9"
      style={{
        fill: "none",
        stroke: "#FF0400",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <Line
      id="secondary-2"
      data-name="secondary"
      x1={3}
      y1={12}
      x2={17}
      y2={12}
      style={{
        fill: "none",
        stroke: "#FF0400",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary"
      d="M10,8V5a1,1,0,0,1,1-1h9a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H11a1,1,0,0,1-1-1V16"
      style={{
        fill: "none",
        stroke: "#FF0400",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
  </Svg>
);

export const NotificationIcon = (props) => (
  <Svg
    width={wp(6)}
        height={hp(3)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z"
      stroke="#fff"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
    />
    <Path
      d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z"
      stroke="#fff"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601"
      stroke="#fff"
      strokeWidth={1.5}
      strokeMiterlimit={10}
    />
  </Svg>
);

export const PencilIcon = (props) => (
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

export const PhoneIcon = (props) => (
  <Svg
    fill="#d3d3d3"
    width={wp(5)}
    height={wp(5)}
    viewBox="0 0 24 24"
    id="phone"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color"
    {...props}
  >
    <Path
      id="primary"
      d="M21,15v3.93a2,2,0,0,1-2.29,2A18,18,0,0,1,3.14,5.29,2,2,0,0,1,5.13,3H9a1,1,0,0,1,1,.89,10.74,10.74,0,0,0,1,3.78,1,1,0,0,1-.42,1.26l-.86.49a1,1,0,0,0-.33,1.46,14.08,14.08,0,0,0,3.69,3.69,1,1,0,0,0,1.46-.33l.49-.86A1,1,0,0,1,16.33,13a10.74,10.74,0,0,0,3.78,1A1,1,0,0,1,21,15Z"
      style={{
        fill: "none",
        stroke: "#d3d3d3",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
  </Svg>
);

export const ProfileEditIcon = (props) => (
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

export const Scan = (props) => (
    <Svg
        width={wp(6)}
        height={wp(6)}
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M0.5 5V2.5C0.5 1.39543 1.39543 0.5 2.5 0.5H5M10 0.5H12.5C13.6046 0.5 14.5 1.39543 14.5 2.5V5M0.5 10V12.5C0.5 13.6046 1.39543 14.5 2.5 14.5H5M14.5 10V12.5C14.5 13.6046 13.6046 14.5 12.5 14.5H10M2 7.5H13"
            stroke="#fff"
        />
    </Svg>
);

export const ScannerIcon = (props) => (
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

export const SearchIcon = (props) => (
  <Svg
    fill="#fff"
    width="26px"
    height="26px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z" />
  </Svg>
);

export const UserIcon = (props) => (
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

export const WalletIcon = (props) => (
  <Svg
    fill="#fff"
    width={wp(6)}
        height={hp(3)}
            viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path d="M19,7H18V6a3,3,0,0,0-3-3H5A3,3,0,0,0,2,6H2V18a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V10A3,3,0,0,0,19,7ZM5,5H15a1,1,0,0,1,1,1V7H5A1,1,0,0,1,5,5ZM20,15H19a1,1,0,0,1,0-2h1Zm0-4H19a3,3,0,0,0,0,6h1v1a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V8.83A3,3,0,0,0,5,9H19a1,1,0,0,1,1,1Z" />
  </Svg>
);
