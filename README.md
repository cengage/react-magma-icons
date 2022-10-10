# React Magma Icons

This repository provides all the icons used in [React Magma](https://github.com/cengage/react-magma).

## Adding new icons
1. Add svg files to the appropriate folder under `src/svg/icons/`.
2. Run the command `npm run build`.
3. Open a PR / commit the changes.
4. Run the command `npm publish`. Confirm that the new version has been released in [NPM](https://www.npmjs.com/package/react-magma-icons/).
5. Update the `package.json` to have the updated package version.
6. In `react-magma`, update all instances of this package to use the new released version.