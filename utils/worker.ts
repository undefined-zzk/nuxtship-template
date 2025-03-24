import markdownit from "markdown-it";
import hljs from "highlight.js";
import DOMPurify from "dompurify";
const md = markdownit({
  highlight: function (str:string, lang:string):string {
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
  html: false, // 禁用 HTML 标签
  linkify: true,
  typographer: true,
  breaks: true,
  xhtmlOut: true,
  quotes: "“”‘’",
});

self.onmessage = function (e) {
  const renderedChunk = md.render(e.data.buffer);
  self.postMessage(renderedChunk);
};

self.onerror = function (e) {
  console.log("error", e);
};
