interface ToDoItem {
  text: string,
  id: string,
  selected:boolean,
  disabled?:boolean
}
const todos:ToDoItem[]=[{text:'测试',id:'1',selected:false,disabled:true}]
export default defineEventHandler((event) => {
  return todos
})
