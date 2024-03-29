// import SVGO from 'svgo';
// import rimraf from 'rimraf';
var queue = require('fastq');
const fg = require('fast-glob');
const path = require('path');
const SVGO = require('svgo');
const fse = require('fs-extra');
const xml2js = require('xml2js');
const iconMap = {};

const v2aliases = [
  { v1: 'AngleDownIcon', category: 'Navigation', v2: 'ExpandMoreIcon' },
  { v1: 'AngleLeftIcon', category: 'Navigation', v2: 'ArrowBackIosIcon' },
  { v1: 'AngleRightIcon', category: 'Navigation', v2: 'ArrowForwardIosIcon' },
  { v1: 'AngleUpIcon', category: 'Navigation', v2: 'ExpandLessIcon' },
  { v1: 'ArrowDoubleIcon', category: 'Navigation', v2: 'SortDoubleArrowIcon' },
  { v1: 'ArrowDown2Icon', category: 'Navigation', v2: 'SouthIcon' },
  { v1: 'ArrowLeft2Icon', category: 'Navigation', v2: 'WestIcon' },
  { v1: 'ArrowRight2Icon', category: 'Navigation', v2: 'EastIcon' },
  { v1: 'ArrowUp2Icon', category: 'Navigation', v2: 'NorthIcon' },
  { v1: 'BlockedIcon', category: 'Content', v2: 'BlockIcon' },
  { v1: 'CalendarIcon', category: 'Actions', v2: 'EventIcon' },
  { v1: 'CaretDownIcon', category: 'Navigation', v2: 'ArrowDropDownIcon' },
  { v1: 'CaretLeftIcon', category: 'Navigation', v2: 'ArrowLeftIcon' },
  { v1: 'CaretRightIcon', category: 'Navigation', v2: 'ArrowRightIcon' },
  { v1: 'CaretUpIcon', category: 'Navigation', v2: 'ArrowDropUpIcon' },
  { v1: 'CrossIcon', category: 'Navigation', v2: 'CloseIcon' },
  { v1: 'Info2Icon', category: 'Actions', v2: 'InfoIcon' },
  { v1: 'Notification2Icon', category: 'Alert', v2: 'ErrorIcon' },
  { v1: 'NotificationIcon', category: 'Alert', v2: 'ErrorOutlineIcon' },
  { v1: 'QuestionCircleOIcon', category: 'Actions', v2: 'HelpOutlineIcon' },
  { v1: 'Search2Icon', category: 'Actions', v2: 'SearchIcon' },
  { v1: 'ClockIcon', category: 'Actions', v2: 'ScheduleIcon' },
  { v1: 'AlertIcon', category: 'Notifications', v2: 'PriorityHighIcon' },
  { v1: 'BellIcon', category: 'Social', v2: 'NotificationsIcon' },
  { v1: 'CircleDownIcon', category: 'Navigation', v2: 'ExpandMoreIcon' },
  { v1: 'CircleLeftIcon', category: 'Navigation', v2: 'ChevronLeftIcon' },
  { v1: 'CircleRightIcon', category: 'Navigation', v2: 'ChevronRightIcon' },
  { v1: 'CircleUpIcon', category: 'Navigation', v2: 'ExpandLessIcon' },
  { v1: 'Cog2Icon', category: 'Actions', v2: 'SettingsIcon' },
  { v1: 'EnvelopeOIcon', category: 'Communication', v2: 'MailOutlineIcon' },
  { v1: 'ExternalLinkIcon', category: 'Actions', v2: 'LaunchIcon' },
  { v1: 'GraduationCapIcon', category: 'Social', v2: 'SchoolIcon' },
  { v1: 'QuestionCircleIcon', category: 'Actions', v2: 'HelpIcon' },
];

const addIcon = (group, name) => {
  iconMap[group] = [...(iconMap[group] || []), name];
};

const doNotEditComment = `/******************************************************
* This file was created by scripts/generate.js as part
* of the build process. Do not edit this file directly.
 ******************************************************/
`;

function componentName(group, str) {
  const prefix = str.match(/^\d/) ? group : '';
  let arr = [prefix, ...str.split(/[-_]/)];
  let capital = arr.map(
    (item, index) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
  );
  return [...capital, 'Icon'].join('');
}

const svgo = new SVGO({
  floatPrecision: 4,
  plugins: [
    { cleanupAttrs: true },
    { removeDoctype: true },
    { removeXMLProcInst: true },
    { removeComments: true },
    { removeMetadata: true },
    { removeTitle: true },
    { removeDesc: true },
    { removeUselessDefs: true },
    { removeXMLNS: true },
    { removeEditorsNSData: true },
    { removeEmptyAttrs: true },
    { removeHiddenElems: true },
    { removeEmptyText: true },
    { removeEmptyContainers: true },
    { removeViewBox: false },
    { cleanupEnableBackground: true },
    { minifyStyles: true },
    { convertStyleToAttrs: true },
    { convertColors: true },
    { convertPathData: true },
    { convertTransform: true },
    { removeUnknownsAndDefaults: true },
    { removeNonInheritableGroupAttrs: true },
    {
      removeUselessStrokeAndFill: {
        // https://github.com/svg/svgo/issues/727#issuecomment-303115276
        removeNone: true,
      },
    },
    { removeUnusedNS: true },
    { cleanupIDs: true },
    { cleanupNumericValues: true },
    { cleanupListOfValues: true },
    { moveElemsAttrsToGroup: true },
    { moveGroupAttrsToElems: true },
    { collapseGroups: true },
    { removeRasterImages: true },
    { mergePaths: true },
    { convertShapeToPath: true },
    { sortAttrs: true },
    { removeDimensions: true },
    { removeAttrs: true },
    { removeElementsByAttr: true },
    { removeStyleElement: true },
    { removeScriptElement: true },
  ],
});

const getPaths = (defs = [], use = []) => {
  return defs
    .map(d => {
      return (
        d.path &&
        d.path.reduce(
          (acc, c) => {
            const { d, id } = c['$'];
            const { transform, fillRule } = {
              ...use
                .filter(u => u['$'].xlinkHref === `#${id}`)
                .map(u => u['$'])[0],
            };
            return { paths: [...acc.paths, { d, transform, fillRule }] };
          },
          { paths: [] }
        )
      );
    })
    .reduce((acc, cur) => {
      return [...acc, cur && cur.paths];
    }, [])
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
    .filter(a => a);
};

const getCircles = (defs = []) => {
  return defs
    .map(d => {
      return (
        d.circle &&
        d.circle.reduce(
          (acc, c) => {
            const { cx, cy, r } = c['$'];
            return { circles: [...acc.circles, { cx, cy, r }] };
          },
          { circles: [] }
        )
      );
    })
    .reduce((acc, cur) => {
      return [...acc, cur && cur.circles];
    }, [])
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
    .filter(a => a);
};

const getNames = path => {
  return path.split(/[/.]/).slice(-3);
};

const getIconFile = (icon, name) => `${doNotEditComment}
import { IconProps } from '../../IconProps';
import { renderIcon } from '../../SvgIcon';
const iconType = ${JSON.stringify(icon, null, 2)};

export const ${name} = (props: IconProps) => renderIcon(props, iconType);
`;

const getAliasFile = ({ v1, v2, category }) => `${doNotEditComment}
import * as React from 'react';
import { IconProps } from '../../IconProps';
import { ${v2} } from '../${category}/${v2}';  
export const ${v1} = (props: IconProps) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn("${v1} has been deprecated, and will be removed in the next major release.  Please check the React Magma docs to find the new set of icons adjust the size/spacing as needed.");
  }
  return <${v2} {...props} />;
};
`;

const worker = async (svgPath, cb) => {
  const [groupName, iconName] = getNames(svgPath);
  addIcon(groupName, componentName(groupName, iconName));

  const input = await fse.readFile(svgPath, { encoding: 'utf8' });
  const result = await svgo.optimize(input);

  let paths = result.data
    .replace(/fill-opacity=/g, 'fillOpacity=')
    .replace(/xlink:href=/g, 'xlinkHref=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/ clip-path=".+?"/g, '')
    .replace(/<clipPath.+?<\/clipPath>/g, '');

  xml2js.parseString(
    paths,
    { mergeAttrs: false },
    async (
      err,
      {
        svg: {
          $: { viewBox, width, height },
          defs,
          use = [],
          path: sPath,
        },
        svg,
      }
    ) => {
      try {
        const svgJson = {
          viewBox,
          width,
          height,
          paths: getPaths(defs || [{ path: sPath }], use),
          circles: getCircles(defs),
        };
        await fse.mkdirp(path.join(__dirname, `../src/icons/${groupName}`));
        await fse.writeFile(
          path.join(
            __dirname,
            `../src/icons/${groupName}/${componentName(
              groupName,
              iconName
            )}.tsx`
          ),
          getIconFile(svgJson, componentName(groupName, iconName))
        );
      } catch (e) {
        console.log(svgPath, e.message, JSON.stringify(defs, null, 2));
      }
    }
  );
  cb(null, 'paths');
};

const writeGroupIndexes = () => {
  fse.writeFile(
    path.join(__dirname, `../src/index.ts`),
    [
      doNotEditComment,
      `export { IconProps } from './IconProps';`,
      `export { SvgIcon } from './SvgIcon';`,
      `export * from './icons/Aliases';`,
      ...Object.keys(iconMap).map(group => `export * from './icons/${group}';`),
      `export { categories } from './categories';`,
    ].join('\n')
  );

  Object.keys(iconMap).forEach(group => {
    fse.writeFile(
      path.join(__dirname, `../src/icons/${group}/index.ts`),
      [
        doNotEditComment,
        ...iconMap[group].map(icon => `export { ${icon} } from './${icon}';`),
      ].join('\n')
    );
  });

  v2aliases.forEach(async alias => {
    await fse.mkdirp(path.join(__dirname, `../src/icons/Aliases`));
    await fse.writeFile(
      path.join(__dirname, `../src/icons/Aliases/${alias.v1}.tsx`),
      getAliasFile(alias)
    );
  });

  fse.writeFile(
    path.join(__dirname, `../src/icons/Aliases/index.ts`),
    [
      doNotEditComment,
      ...v2aliases.map(icon => `export { ${icon.v1} } from './${icon.v1}';`),
    ].join('\n')
  );

  fse.writeFile(
    path.join(__dirname, `../src/categories.ts`),
    `${doNotEditComment}
export const categories = ${JSON.stringify(iconMap, null, 2)}`
  );
};

fse.removeSync(path.join(__dirname, `../src/icons`));
const q = queue(worker, 8);
q.drain = () => {
  writeGroupIndexes();
};

const icons = fg.sync(path.join(__dirname, '../src/svg/icons/**/*.svg'));
icons.forEach(icon =>
  q.push(icon, function (err, result) {
    if (err) {
      throw err;
    }
  })
);
