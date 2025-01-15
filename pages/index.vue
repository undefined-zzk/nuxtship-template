<script lang="ts" setup>
const weblist = ref([
  {
    title: "Bring Your Own Framework",
    description:
      "Build your site using Vue, web components, or just plain ol' HTML + JavaScript.",
    icon: "uil:circle-layer",
  },
  {
    title: "100% Static HTML, No JS",
    description:
      "Nuxt renders your entire page to static HTML, removing all JavaScript from your final build by default.",
    icon: "uil:hospital-symbol",
  },
  {
    title: "On-Demand Components",
    description:
      "Need some JS? Nuxt can automatically hydrate interactive components when they become visible on the page.  ",
    icon: "uil:google-play",
  },
  {
    title: "Broad Integration",
    description:
      "Nuxt supports TypeScript, Scoped CSS, CSS Modules, Sass, Tailwind, Markdown, MDX, and any other npm packages.",
    icon: "uil:instagram-alt",
  },
  {
    title: "SEO Enabled",
    description:
      "Automatic sitemaps, RSS feeds, pagination and collections take the pain out of SEO and syndication. It just works!",
    icon: "uil:raindrops-alt",
  },
  {
    title: "Community",
    description:
      "Nuxt is an open source project powered by hundreds of contributors making thousands of individual contributions.",
    icon: "uil:slack-alt",
  },
])

const icons = computed(() => {
  return weblist.value.map(item => item.icon)
})
</script>
<template>
  <div class="min-h-screen">
    <div class="lg:flex block lg:gap-x-10">
      <div class="flex-1 lg:pt-24 pt-10">
        <div class="font-bold text-5xl lg:text-6xl xl:text-7xl lg:-tracking-tight">Marketing website done with Nuxt
        </div>
        <div class=" my-6 text-gray-500 text-xl">
          Nuxtship is a starter template for startups, marketing websites & landing pages. Built with Nuxt &
          TailwindCSS. You can quickly create any website with this starter.
        </div>
        <div class="md:flex block items-center gap-3">
          <div
            class="lg:w-32 md:mb-0 mb-3 rounded-md md:w-1/2 text-center py-3 border-2 border-gray-950 text-white bg-black hover:bg-gray-800 w-full cursor-pointer">
            Get Started</div>
          <div class="lg:w-32 rounded-md md:w-1/2 w-full text-center py-3 border-gray-950 border-2 cursor-pointer">View
            Repo</div>
        </div>
      </div>
      <div class="md:flex-1 hidden md:flex items-center justify-center">
        <img class="rounded-full md:p-40 transition-transform hover:scale-125 lg:p-24 w-full h-full"
          src="~/assets/img/hero.jpg" alt="Starship starts the engine" loading="eager" format="avif" width="512"
          height="512">
      </div>
    </div>
    <div class="mb-5 lg:mt-0 mt-5">
      <div class="font-bold lg:text-5xl text-3xl -tracking-tight">
        Everything you need to start a website
      </div>
      <div class="text-gray-400 mt-5 text-lg">
        Nuxt comes batteries included. It takes the best parts of state-of-the-art tools and adds its own innovations.
      </div>
    </div>
    <div class="mt-20 md:grid-cols-3 sm:grid-cols-2 grid gap-16">
      <div class="flex gap-x-3" v-for="(item, idx) in weblist" :key="idx">
        <div>
          <div class="rounded-full overflow-hidden flex items-center justify-center p-2 bg-black">
            <Icon :name="item.icon" class="text-white"></Icon>
          </div>
        </div>
        <div>
          <div class="mb-3 text-xl text-black -tracking-tight font-bold">{{ item.title }}</div>
          <div class="text-gray-400">{{ item.description }}</div>
        </div>
      </div>
    </div>
    <div class="text-gray-400 text-center mt-20 mb-10">Works with your technologies</div>
    <div class="flex items-center justify-center gap-10 flex-wrap">
      <Icon class="md:text-6xl text-5xl" :name="icon" :key="idx" v-for="(icon, idx) in icons"></Icon>
    </div>
    <div class="bg-slate-800 rounded-md flex flex-col items-center md:p-20 p-10 gap-5 my-10">
       <div class="text-white text-2xl lg:text-6xl">Build faster websites.</div>
       <div class="md:text-xl text-base break-all md:p-0 px-10 text-gray-400">Static or Dynamic, the choice is yours with Nuxt's hybrid rendering modes.</div>
       <div class="text-black bg-white rounded-md p-4 cursor-pointer">Get Started</div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>