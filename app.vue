<script lang="ts" setup>

</script>
<template>
  <NuxtLayout>
    <el-config-provider :message="{ max: 1 }">
      <NuxtPage />
      <OpenAI></OpenAI>
    </el-config-provider>
  </NuxtLayout>
</template>

<style lang="scss">
@import url('normalize.css');

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

:root {
  font-family: 'Roboto';
}
</style>
