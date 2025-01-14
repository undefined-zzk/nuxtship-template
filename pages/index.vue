<script lang="ts" setup>
const toast = useToast();
import type { FormSubmitEvent } from "#ui/types";
import { nanoid } from "nanoid";
const loading = ref(false);

const { data: todos } = useFetch("/api/test");

const todoObj = reactive({
  text: "",
});

function onSubmit(event: FormSubmitEvent<{ text: string }>) {
  loading.value = true;
  const obj = {
    text: event.data.text,
    id: nanoid(),
    disabled: false,
    selected: false,
  };
  setTimeout(() => {
    todos.value?.unshift(obj);
    loading.value = false;
    todoObj.text = "";
  }, Math.ceil(Math.random() * 1000));
}

const delTodo = (id: string) => {
  todos.value = todos.value?.filter((item) => item.id !== id) || [];
};
onMounted(() => {
  toast.add({
    title: "把要做的事记录下来吧！",
    description: "轻松帮你记录任务单",
  });
});
</script>
<template>
  <div>
    <UForm :state="todoObj" class="flex gap-1 mt-6" @submit="onSubmit">
      <UInput size="xl" required class="flex-1" v-model="todoObj.text" />
      <UButton
        type="submit"
        size="xl"
        icon="i-heroicons-plus-20-solid"
        :loading="loading"
      ></UButton>
    </UForm>
    <ul class="mt-4">
      <li
        class="flex items-center justify-between border-y border-t-0 py-2"
        v-for="item in todos"
        :key="item.id"
      >
        <span class="pr-4 break-all">{{ item.text }}</span>
        <div class="flex items-center gap-1">
          <UToggle v-model="item.selected" :disabled="item.disabled" />
          <UButton
            @click="delTodo(item.id)"
            :disabled="item.disabled"
            color="red"
            variant="solid"
            size="xl"
            icon="i-heroicons-x-mark-20-solid"
          >
          </UButton>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>
