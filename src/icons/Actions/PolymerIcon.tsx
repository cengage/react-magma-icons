/******************************************************
 * This file was created by scripts/generate.js as part
 * of the build process. Do not edit this file directly.
 ******************************************************/

import { IconProps } from "../../IconProps";
import { renderIcon } from "../../SvgIcon";
const iconType = {
  viewBox: "0 0 24 24",
  paths: [
    {
      d: "M19 4h-4L7.11 16.63 4.5 12 9 4H5L.5 12 5 20h4l7.89-12.63L19.5 12 15 20h4l4.5-8z",
      fillRule: "evenodd",
    },
  ],
  circles: [],
};

export const PolymerIcon = (props: IconProps) => renderIcon(props, iconType);
