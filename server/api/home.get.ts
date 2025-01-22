export default defineEventHandler(() => {
  const weblist = [
    {
      title: "Bring Your Own Framework",
      titlezh: "带来自己的框架",
      description:
        "Build your site using Vue, web components, or just plain ol' HTML + JavaScript.",
      desczh: "使用 Vue、Web 组件或普通的 HTML + JavaScript 构建您的网站。",
      icon: "uil:circle-layer",
    },
    {
      title: "100% Static HTML, No JS",
      titlezh: "100％静态 HTML，无 JS",
      desczh:
        "Nuxt 将你的整个页面呈现为静态 HTML，默认从最终构建中删除所有 JavaScript。",
      description:
        "Nuxt renders your entire page to static HTML, removing all JavaScript from your final build by default.",
      icon: "uil:hospital-symbol",
    },
    {
      title: "On-Demand Components",
      titlezh: "按需组件",
      desczh: "需要一些 JS？当交互组件在页面上可见时，Nuxt 可以自动补充它们。",
      description:
        "Need some JS? Nuxt can automatically hydrate interactive components when they become visible on the page.",
      icon: "uil:google-play",
    },
    {
      title: "Broad Integration",
      titlezh: "广泛整合",
      desczh:
        "Nuxt 支持 TypeScript、Scoped CSS、CSS Modules、Sass、Tailwind、Markdown、MDX 以及任何其他 npm 包。",
      description:
        "Nuxt supports TypeScript, Scoped CSS, CSS Modules, Sass, Tailwind, Markdown, MDX, and any other npm packages.",
      icon: "uil:instagram-alt",
    },
    {
      title: "SEO Enabled",
      titlezh: "已启用 SEO",
      desczh:
        "自动站点地图、RSS 源、分页和集合让 SEO 和联合变得轻松无比。它真的有效！",
      description:
        "Automatic sitemaps, RSS feeds, pagination and collections take the pain out of SEO and syndication. It just works!",
      icon: "uil:raindrops-alt",
    },
    {
      title: "Community",
      titlezh: "社区",
      desczh:
        "Nuxt 是一个开源项目，由数百名贡献者提供支持，并做出了数千项个人贡献。",
      description:
        "Nuxt is an open source project powered by hundreds of contributors making thousands of individual contributions.",
      icon: "uil:slack-alt",
    },
  ];
  return weblist;
});
