import { objectWithoutPropertiesLoose as _objectWithoutPropertiesLoose } from './_virtual/_rollupPluginBabelHelpers.js';
import { createElement, useState, useEffect } from 'react';
import { v4 } from 'uuid';

function generateId(id) {
  return id ? id : v4();
}

function useGenerateId(newId) {
  var _React$useState = useState(generateId(newId)),
      id = _React$useState[0],
      updateId = _React$useState[1];

  useEffect(function () {
    newId && updateId(generateId(newId));
  }, [newId]);
  return id;
}

function renderPaths(paths) {
  if (paths === void 0) {
    paths = [];
  }

  return paths.filter(function (a) {
    return a;
  }).map(function (_ref, index) {
    var d = _ref.d,
        other = _objectWithoutPropertiesLoose(_ref, ["d"]);

    return createElement("path", Object.assign({
      key: index,
      d: d
    }, other));
  });
}

function renderCircles(circles) {
  if (circles === void 0) {
    circles = [];
  }

  return circles.filter(function (a) {
    return a;
  }).map(function (_ref2, index) {
    var cx = _ref2.cx,
        cy = _ref2.cy,
        r = _ref2.r;
    return createElement("circle", {
      key: index,
      cx: cx,
      cy: cy,
      r: r
    });
  });
}

var SvgIcon = function SvgIcon(_ref3) {
  var _ref3$color = _ref3.color,
      color = _ref3$color === void 0 ? 'currentColor' : _ref3$color,
      _ref3$size = _ref3.size,
      size = _ref3$size === void 0 ? 24 : _ref3$size,
      defaultId = _ref3.id,
      title = _ref3.title,
      testId = _ref3.testId,
      _ref3$paths = _ref3.paths,
      paths = _ref3$paths === void 0 ? [] : _ref3$paths,
      _ref3$circles = _ref3.circles,
      circles = _ref3$circles === void 0 ? [] : _ref3$circles,
      other = _objectWithoutPropertiesLoose(_ref3, ["color", "size", "id", "title", "testId", "paths", "circles"]);

  var id = useGenerateId(defaultId);
  return createElement("svg", Object.assign({}, other, {
    className: "icon",
    xmlns: "http://www.w3.org/2000/svg",
    fill: color,
    height: size,
    width: size,
    "aria-labelledby": title ? id : undefined,
    "data-testid": testId
  }), title && createElement("title", {
    id: id
  }, title), paths.length !== 0 && renderPaths(paths), circles.length !== 0 && renderCircles(circles));
};
function renderIcon(props, iconType) {
  return iconType ? createElement(SvgIcon, Object.assign({}, props, iconType)) : null;
}

export { SvgIcon, renderIcon };
//# sourceMappingURL=SvgIcon.esm.js.map
