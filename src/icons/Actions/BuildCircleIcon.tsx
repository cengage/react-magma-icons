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
      d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m4.54 13.85-.69.69c-.39.39-1.02.39-1.41 0l-3.05-3.05c-1.22.43-2.64.17-3.62-.81-1.11-1.11-1.3-2.79-.59-4.1l2.35 2.35 1.41-1.41-2.36-2.35c1.32-.71 2.99-.52 4.1.59.98.98 1.24 2.4.81 3.62l3.05 3.05c.39.39.39 1.03 0 1.42",
      fillRule: "evenodd",
    },
  ],
  circles: [],
};

export const BuildCircleIcon = (props: IconProps) =>
  renderIcon(props, iconType);
