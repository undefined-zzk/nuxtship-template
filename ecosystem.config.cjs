export default {
  apps: [
    {
      name: 'nuxt-ship',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
    },
  ],
}
