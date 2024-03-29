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
      d: "M17 1c1.1 0 2 .9 2 2v3c0 .55-.45 1-1 1l-.1162-.0068C17.388 6.9352 17 6.5107 17 6H7v12h10c0-.55.45-1 1-1l.1162.0068c.4958.058.8838.4825.8838.9932v3c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V3c0-1.1.9-1.99 2-1.99zm1 8.21c0-.45.54-.67.86-.35l2.79 2.79c.19.19.19.51-.01.7l-2.79 2.79c-.31.32-.85.1-.85-.35V13h-4c-.55 0-1-.45-1-1l.0068-.1162C13.0648 11.388 13.4893 11 14 11h4z",
    },
  ],
  circles: [],
};

export const SendToMobileIcon = (props: IconProps) =>
  renderIcon(props, iconType);
