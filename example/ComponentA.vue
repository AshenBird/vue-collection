<script setup lang="tsx">
import { useMessage } from 'naive-ui';
import { onMounted, ref } from 'vue';
import { useMount } from "../src/source/index";
import ComponentB from "./ComponentB.vue";
const Message = useMessage();
const mount = useMount();
const test = () => {
  setTimeout(() => {
    Message.success('test');
  }, 1000);
  const visible = ref(false);
  const handler = mount({
    content:()=><ComponentB visible={visible.value} ></ComponentB>
  })
  setTimeout(() => {
    visible.value = true;
    setTimeout(() => {
      handler.destroy();
    }, 2000);
  }, 2000);
}


onMounted(() => {
  test();
});

</script>
<template>
  <div>hello world</div>
</template>