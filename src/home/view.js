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
  const imgSrc = el.data.audits["final-screenshot"].details.data;
  const time = toSeconds(el.data.audits.interactive.rawValue);
  return html`
    <li>
      <div>
        <a alt="{${url}}" href="${url}"><img width="100%" src=${imgSrc}/></a>
        <div class="info">
          <a alt=${url} href="${url}">${url}</a> <span>${time} secs</span>
        </div>
      </div>
    </li>
  `;
};

const renderPaging = async ({ result, currentPage }) => {
  if (result.length < 1) {
    return;
  }

  let nextPage = Number(currentPage) + 1;

  let paging = html`
    <div class="paging"><a href=${nextPage}>Next</a></div>
  `;

  return render(paging);
};

const renderMarkup = async ({ currentPage }) => {
  const result = await loadFromFirestore({ currentPage });
  let list = "";
  let paging = "";
  if (!result.length) {
    list = html`
      <ul>
        <li>no records found</li>
      </ul>
    `;
  } else {
    list = html`
      <ul>
        ${result.map(mapItems)}
      </ul>
    `;

    paging = await renderPaging({ result, currentPage });
  }

  list = await render(list);

  return `${paging} ${list} ${paging}`;
};

export const view = async ({ currentPage }) => {
  let html = "";
  try {
    html = await renderMarkup({ currentPage });
  } catch (e) {
    html = e.message;
  }

  const template = path.resolve(__dirname, "template.pug");
  return pug.renderFile(template, { html });
};
