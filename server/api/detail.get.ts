const user = {
  '1': { name: '张三' },
  '2': { name: '李四' },
  '3': { name: '王五' },
  '4': { name: '赵六' },
}
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return user[query.id]
})
