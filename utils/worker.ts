import markdownit from "markdown-it";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
import linkAttributes from "markdown-it-link-attributes";
import markdownitAnchor from "markdown-it-anchor";
import markdownitTableOfContents from "markdown-it-table-of-contents";
import markdownitSup from "markdown-it-sup";
import markdownitMark from "markdown-it-mark";
import markdownitTaskLists from "markdown-it-task-lists";
import { full as emoji } from "markdown-it-emoji";
const md = markdownit({
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value;
        return `<pre><code class="hljs">${DOMPurify.sanitize(
          highlighted
        )}</code></pre>`;
      } catch (__) {}
    }
    return (
      '<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
  html: false,
  linkify: false,
  typographer: true,
  breaks: true,
  xhtmlOut: true,
  quotes: "“”‘’",
});
md.use(emoji)
  .use(markdownitAnchor)
  .use(markdownitTableOfContents)
  .use(markdownitSup)
  .use(markdownitMark)
  .use(markdownitTaskLists, {
    enabled: true,
    label: true,
    labelAfter: true,
  })
  .use(linkAttributes, {
    target: "_blank",
    rel: "noopener",
  });
self.onmessage = function (e) {
  const renderedChunk = md.render(e.data.buffer);
  self.postMessage(renderedChunk);
};

self.onerror = function (e) {
  console.log("error", e);
};
