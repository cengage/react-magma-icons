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
      d: "M7 24h2v-2H7zm4 0h2v-2h-2zm4 0h2v-2h-2zM16 .01 8 0C6.9 0 6 .9 6 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V2c0-1.1-.9-1.99-2-1.99M16 16H8V4h8z",
      fillRule: "evenodd",
    },
  ],
  circles: [],
};

export const SettingsCellIcon = (props: IconProps) =>
  renderIcon(props, iconType);
