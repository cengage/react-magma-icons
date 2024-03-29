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
      d: "M18.05 19.29c-.39.39-1.02.39-1.41 0l-2.12-2.12a.9959.9959 0 010-1.41c.39-.39 1.02-.39 1.41 0l1.41 1.41 3.54-3.54c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-4.24 4.25zM12 17c0-3.87 3.13-7 7-7 1.08 0 2.09.25 3 .68V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v18l4-4h6c0-.17.01-.33.03-.5-.02-.17-.03-.33-.03-.5z",
      fillRule: "evenodd",
    },
  ],
  circles: [],
};

export const MarkChatReadIcon = (props: IconProps) =>
  renderIcon(props, iconType);
