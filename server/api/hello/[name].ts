export default defineEventHandler((event) => {
  const name = getRouterParam(event, 'name')
  event.waitUntil(backTask())
  console.log('name', name)
  return `hello ,${name}`
})

function backTask() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('ffffffffkkkkkkkkkk')
      resolve(true)
    }, 2000)
  })
}
