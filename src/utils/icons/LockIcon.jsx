import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = (props) => (
  <Svg
    width="25px"
    height="25px"
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
export default SVGComponent;
