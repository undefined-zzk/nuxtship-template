export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('close', async () => {
    // Will run when nitro is being closed
  })
})
