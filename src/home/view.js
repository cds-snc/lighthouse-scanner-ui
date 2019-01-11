const pug = require("pug");
const path = require("path");
export const view = pug.renderFile(path.resolve(__dirname, "template.pug"), {});
