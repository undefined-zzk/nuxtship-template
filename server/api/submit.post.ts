import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return body
})
