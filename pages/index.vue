<script lang="ts" setup>
const toast = useToast()
import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const loading = ref(false)
const schema = object({
  email: string().min(1, '内容不能为空').required('Required')
})
const {data:todos}=useFetch('/api/test')
type Schema = InferType<typeof schema>

const todoObj = reactive({
  text: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
onMounted(() => {
  toast.add({
    title: '把要做的事记录下来吧！',
    description: '轻松帮你记录任务单',
  })
})
</script>
<template>
  <div>
    <UForm :schema="schema" :state="todoObj" class="flex gap-1 mt-6" @submit="onSubmit">
      <UInput size="xl" required class="flex-1" v-model="todoObj.text" />
      <UButton type="submit" size="xl" icon="i-heroicons-plus-20-solid" :loading="loading"></UButton>
    </UForm>
    <ul class="mt-4">
      <li class="flex items-center justify-between border-y border-t-0 py-2" v-for="item in todos" :key="item.id">
        <span class="pr-4 break-all">{{ item.text }}</span>
        <div class="flex items-center gap-1">
          <UToggle v-model="item.selected" :disabled="item.disabled" />
          <UButton :disabled="item.disabled" color="red" variant="soft" size="xl" icon="i-heroicons-x-mark-20-solid"></UButton>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>