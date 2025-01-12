export default defineEventHandler((event) => {
  return {
    list: [
      { name: '李四', age: 18 },
      { name: '张三', age: 19 },
    ],
    nums: [{ a: 1, b: 2 }],
  }
})
