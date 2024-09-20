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
      d: "M17 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H7c-1.1 0-1.99-.9-1.99-2V3c0-1.1.89-2 1.99-2zm0 5H7v12h10zm-5 9c.5523 0 1 .4477 1 1s-.4477 1-1 1-1-.4477-1-1 .4477-1 1-1m0-8c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1",
    },
  ],
  circles: [],
};

export const SecurityUpdateWarningIcon = (props: IconProps) =>
  renderIcon(props, iconType);
