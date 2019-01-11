import { loadFromFirestore } from "../lib/firestore";
import htm from "htm";
import { h } from "preact";
import { render } from "preact-render-to-string";

const pug = require("pug");
const path = require("path");
const html = htm.bind(h);

const toSeconds = milliseconds => {
  return (milliseconds / 1000.0).toFixed(2);
};

const mapItems = el => {
  const url = el.data.finalUrl;
  const time = toSeconds(el.data.audits.interactive.rawValue);
  return html`
    <li><a href="${url}">${url}</a> ${time} secs</li>
  `;
};

const outputList = async () => {
  const result = await loadFromFirestore();
  return html`
    <ul>
      ${result.map(mapItems)}
    </ul>
  `;
};

const renderMarkup = async () => {
  return render(await outputList());
};

export const view = async () => {
  const rendered = await renderMarkup();
  return pug.renderFile(path.resolve(__dirname, "template.pug"), {
    html: rendered
  });
};
