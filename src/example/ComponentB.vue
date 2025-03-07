<script setup lang="ts">
import { NModal } from "naive-ui";
const visible = defineModel<boolean>("visible");

</script>
<template>
  <NModal v-model:show="visible" title="标题" preset="card" >
    <div>foo</div>
    <template #footer>
      <div>bar</div>
    </template>
  </NModal>
</template>