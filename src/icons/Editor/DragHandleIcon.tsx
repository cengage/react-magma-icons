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
      d: "M19 9H5c-.55 0-1 .45-1 1s.45 1 1 1h14c.55 0 1-.45 1-1s-.45-1-1-1zM5 15h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1z",
      fillRule: "evenodd",
    },
  ],
  circles: [],
};

export const DragHandleIcon = (props: IconProps) => renderIcon(props, iconType);
